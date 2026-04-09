import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, EventStatus } from 'src/events/events.entity';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import axios from 'axios';
import * as crypto from 'crypto'
import { EventAttendee } from 'src/events/events-entity.entity';
import 'dotenv/config'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from 'src/users/users.entity';

@Injectable()
export class PaymentService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cache: Cache,

        @InjectRepository(Event)
        private eventRepo: Repository<Event>,

        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,

        @InjectRepository(EventAttendee)
        private eventAttendeeRepo: Repository<EventAttendee>,

        // FIX 2: inject User repo so we can fetch the email
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {}

    private getEventPrice(event: Event): number {
        if (!event.tickets || event.tickets.length === 0) {
            return 0;
        }

        const prices = event.tickets
            .map(ticket => parseFloat(ticket.price || '0'))
            .filter(price => !isNaN(price));

        if (prices.length === 0) {
            return 0;
        }

        return Math.min(...prices);
    }

    async initPayment(eventId: string, userId: string) {
        const event = await this.eventRepo.findOne({ where: { id: eventId } })

        if (!event) {
            throw new NotFoundException('Event not found')
        }

        const existingPayment = await this.paymentRepo.findOne({
            where: {
                event: { id: eventId },
                user: { id: userId },
                status: PaymentStatus.SUCCESS
            }
        })

        if (existingPayment) {
            throw new BadRequestException('You have already paid for this event')
        }

        // FIX 2: fetch the actual user so we have their email for Paystack
        const user = await this.userRepo.findOne({ where: { id: userId } })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const reference = `EVT_${Date.now()}_${userId}`

        const eventPrice = this.getEventPrice(event);

        const payment = this.paymentRepo.create({
            user: { id: userId },
            event: { id: eventId },
            amount: eventPrice * 100, // stored in kobo
            reference
        })

        await this.paymentRepo.save(payment)

        // Initialize Paystack — now using real user email
        const res = await axios.post(
            'https://api.paystack.co/transaction/initialize', 

            {
                email: user.email,       // FIX 2: use fetched user email
                amount: eventPrice * 100, // kobo
                reference,
            },
        
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        return {
            authorizationUrl: res.data.data.authorization_url,
            reference
        }
    }

    async verifyPayment(reference: string) {
        const payment = await this.paymentRepo.findOne({ where: { reference }})

        if (!payment) {
            throw new NotFoundException('Payment not found')
        }

        const res = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,

            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        )

        return {
            paymentStatus: payment.status,
            gatewayStatus: res.data.data.status
        }
    }

    async handlePaystackWebhook(payload: any, signature: string, rawBody: Buffer) {
        this.verifySignature(rawBody, signature)

        if (payload.event !== 'charge.success') return
        
        const { reference, amount } = payload.data

        // FIX 4: load event with creator relation so cache.del works
        const payment = await this.paymentRepo.findOne({
            where: { reference },
            relations: ['event', 'event.creator', 'user']
        })

        if (!payment) return

        // FIX 3: both values are in kobo — compare directly
        if (payment.amount !== amount) {
            throw new Error('Amount mismatch');
        }

        if (payment.event.status !== EventStatus.ACTIVE) return

        if (payment.status === PaymentStatus.SUCCESS) return

        payment.status = PaymentStatus.SUCCESS
        await this.paymentRepo.save(payment)

        const alreadyAttending = await this.eventAttendeeRepo.findOne({
            where: {
                user: { id: payment.user.id },
                event: { id: payment.event.id }
            }
        })

        if (alreadyAttending) return

        const attendee = await this.eventAttendeeRepo.save(
            this.eventAttendeeRepo.create({ 
                user: payment.user,
                event: payment.event
            })
        )

        const qrHash = crypto
            .createHmac('sha256', process.env.QR_SECRET!)
            .update(attendee.id)
            .digest('hex')

        attendee.qrHash = qrHash

        await this.eventAttendeeRepo.save(attendee)

        // FIX 4: creator is now loaded via the relation above
        await this.cache.del(`analytics:creator:${payment.event.creator.id}`);
    }

    private verifySignature(rawBody: Buffer, signature: string) {
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(rawBody)
            .digest('hex')

        if (hash !== signature) {
            throw new UnauthorizedException('Invalid Webhook Signature')
        }
    }
}