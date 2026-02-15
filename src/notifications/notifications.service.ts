import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notifications.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import * as nodemailer from 'nodemailer'
import 'dotenv/config'
import { Cron } from '@nestjs/schedule';
import { Event } from 'src/events/events.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepo: Repository<Notification>,
    ) {}

    private transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    @Cron('* * * * *')
    async sendScheduledNotifications() {
        const now = new Date()

        const notifications = await this.notificationRepo.find({
            where: {
                sent: false,
                scheduledFor: LessThanOrEqual(now)
            },
            relations: ['user', 'event']
        })

        for (const notification of notifications) {
            await this.transporter.sendMail({
                to: notification.user.email,
                subject: `Reminder: ${notification.event.title}`,
                text: `Your event ${notification.event.title} is coming up soon.`
            })

            notification.sent = true
            notification.sentAt = new Date()

            await this.notificationRepo.save(notification)
        }
    }

    async scheduleReminders(userId: string, event: Event, when: Date) {
        return this.notificationRepo.save({
            user: { id: userId },
            event,
            type: 'EVENT_REMINDER',
            scheduledFor: when
        })
    }
}
