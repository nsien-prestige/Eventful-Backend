import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventAttendee } from 'src/events/events-entity.entity';
import { Event } from 'src/events/events.entity';
import { Payment, PaymentStatus } from 'src/payment/payment.entity';
import { In, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cache: Cache,

        @InjectRepository(Event)
        private eventRepo: Repository<Event>,

        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,

        @InjectRepository(EventAttendee)
        private attendeeRepo: Repository<EventAttendee>
    ) {}

    async creatorOverview(creatorId: string) {
        const events = await this.eventRepo.find({
            where: { creator: { id: creatorId } }
        })

        const eventIds = events.map(e => e.id)

        if (eventIds.length === 0) {
            return {
                totalEvents: 0,
                totalTicketsSold: 0,
                totalRevenue: 0,
                totalAttendees: 0
            }
        }

        const payments = await this.paymentRepo.find({
            where: {
                event: { id: In(eventIds) },
                status: PaymentStatus.SUCCESS
            }
        })

        const totalRevenue = payments.reduce(
            (sum, p) => sum + p.amount, 
            0
        )

        const totalAttendees = await this.attendeeRepo.count({
            where: {
                event: { id: In(eventIds)}
            }
        })

        return {
            totalEvents: events.length,
            totalTicketsSold: payments.length,
            totalRevenue,
            totalAttendees
        }
    }

    async eventAnalytics(eventId: string, creatorId: string) {
        const event = await this.eventRepo.findOne({
            where: { id: eventId },
            relations: ['creator'] 
        })

        if(!event) {
            throw new NotFoundException('Event not found')
        }

        if (event.creator.id !== creatorId) {
            throw new ForbiddenException('Not your event')
        }

        const successfulPayments = await this.paymentRepo.count({
            where: {
                event: { id: eventId },
                status: PaymentStatus.SUCCESS
            }
        })

        const failedPayments = await this.paymentRepo.count({
            where: {
                event: { id: eventId },
                status: PaymentStatus.FAILED
            }
        })

        const revenue = await this.paymentRepo
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'sum')
            .where('payment.eventId = :eventId', { eventId })
            .andWhere('payment.status = :status', {
                status: PaymentStatus.SUCCESS
            })
            .getRawOne()  

        const attendees = await this.attendeeRepo.count({
            where: { event: { id: eventId } }
        })

        const scannedCount = await this.attendeeRepo.count({
            where: {
                event: { id: eventId },
                scannedAt: Not(IsNull())
            }
        })

        return {
            eventId,
            ticketsSold: successfulPayments,
            successfulPayments,
            failedPayments,
            revenue: Number(revenue.sum || 0),
            attendees,
            scannedCount,
        }
    }
}
