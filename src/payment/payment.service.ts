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
import { raw } from 'express';

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
        private eventAttendeeRepo: Repository<EventAttendee>
    ) {}

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

        const reference = `EVT_${Date.now()}_${userId}`

        const payment = this.paymentRepo.create({
            user: { id: userId },
            event: { id: eventId },
            amount: event.price * 100,
            reference
        })

        await this.paymentRepo.save(payment)

        //Initialize PayStack
        const res = await axios.post(
            'https://api.paystack.co/transaction/initialize', 

            {
                email: payment.user.email,
                amount: event.price * 100,
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

        if(payload.event !== 'charge.success') return
        
        const { reference, amount} = payload.data

        const payment = await this.paymentRepo.findOne({
            where: { reference }
        })

        if (!payment) return

        if (payment.amount !== amount / 100) {
            throw new Error('Amount mismatch');
        }

        if (payment.event.status !== EventStatus.ACTIVE) return

        if (payment.status === PaymentStatus.SUCCESS) return

        payment.status = PaymentStatus.SUCCESS
        await this.paymentRepo.save(payment)

        const alreadyAttending = await this.eventAttendeeRepo.findOne({
            where: {
                user: { id: payment.user.id},
                event: { id: payment.event.id}
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
