import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from 'src/events/create-event.dto';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './events.entity';
import { EventAttendee } from './events-entity.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotificationsService } from 'src/notifications/notifications.service';
import { randomBytes } from 'crypto';
import { User } from 'src/users/users.entity';
import { UserRole } from 'src/auth/enums/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EventsService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cache: Cache,

        @InjectRepository(Event)
        private eventRepo: Repository<Event>,

        @InjectRepository(EventAttendee)
        private attendeeRepo: Repository<EventAttendee>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        private notificationsService: NotificationsService,
        private jwtService: JwtService,
) {}

    async create(dto: CreateEventDto, creatorId: string) {

        const user = await this.userRepo.findOne({
            where: { id: creatorId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        let newToken: string | null = null;

        // 🔥 Auto-promote
        if (!user.roles.includes(UserRole.CREATOR)) {
            user.roles.push(UserRole.CREATOR);
            await this.userRepo.save(user);

            // 🔥 Reissue JWT with updated roles
            newToken = this.jwtService.sign({
                id: user.id,
                email: user.email,
                roles: user.roles
            });
        }

        const event = this.eventRepo.create({
            ...dto,
            date: new Date(dto.date),
            creator: { id: creatorId },
            publicId: randomBytes(8).toString('hex')
        });

        const saved = await this.eventRepo.save(event);

        const reminderTime = new Date(saved.date);
        reminderTime.setHours(reminderTime.getHours() - 24);

        await this.notificationsService.scheduleReminders(
            creatorId,
            saved,
            reminderTime
        );

        await this.cache.del('events:all');

        return {
            event: saved,
            token: newToken
        };
    }

    findByCreator(creatorId: string) {
        return this.eventRepo.find({
            where: { creator: { id: creatorId } }
        })
    }

    async findAll() {
        const cacheKey = 'events:all'

        const cached = await this.cache.get(cacheKey)
        if (cached) return cached

        const events = await this.eventRepo.find()

        await this.cache.set(cacheKey, events, 120)
        return events
    }

    async attendEvent(eventId: string, userId: string) {

        const event = await this.eventRepo.findOne({
            where: { id: eventId }
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.status !== 'ACTIVE') {
            throw new ConflictException('Event is not active');
        }

        const existing = await this.attendeeRepo.findOne({
            where: {
                user: { id: userId },
                event: { id: eventId }
            }
        });

        if (existing) {
            throw new ConflictException('You already have a ticket for this event');
        }

        // 🔥 Capacity check
        if (event.capacity) {
            const attendeeCount = await this.attendeeRepo.count({
                where: { event: { id: eventId } }
            });

            if (attendeeCount >= event.capacity) {
                event.status = EventStatus.CLOSED;

                await this.eventRepo.save(event);
                throw new ConflictException('Event is sold out');
            }
        }

        const attendance = this.attendeeRepo.create({
            user: { id: userId },
            event: { id: eventId }
        });

        await this.attendeeRepo.save(attendance);

        const reminderTime = new Date(event.date);
        reminderTime.setHours(reminderTime.getHours() - 24);

        await this.notificationsService.scheduleReminders(
            userId,
            event,
            reminderTime
        );

        return attendance;
    }

    async getAttendees(eventId: string, creatorId: string) {
        const event = await this.eventRepo.findOne({
            where: { id: eventId },
            relations: ['creator']
        })

        if (!event) {
            throw new NotFoundException('Event not found')
        }

        if (event.creator.id !== creatorId) {
            throw new ForbiddenException('You are not the creator of this event')
        }

        return this.attendeeRepo.find({
            where: { event: { id: eventId } }
        })
    }

    async findByPublicId(publicId: string) {
        const event = await this.eventRepo.findOne({
            where: { publicId }
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // 🔥 increment view
        await this.eventRepo.increment(
            { publicId },
            'viewCount',
            1
        );

        // 🔥 count attendees
        const attendeesCount = await this.attendeeRepo.count({
            where: { event: { id: event.id } }
        });

        const ticketsLeft = event.capacity
            ? event.capacity - attendeesCount
            : null;

        return {
            ...event,
            attendeesCount,
            ticketsLeft
        };
    }

    async incrementView(publicId: string) {
        await this.eventRepo.increment(
            { publicId },
            'viewCount',
            1
        );
    }

    async delete(eventId: string, creatorId: string) {
        const event = await this.eventRepo.findOne({
            where: { id: eventId },
            relations: ['creator']
        })

        if (!event) {
            throw new NotFoundException('Event not found')
        }

        if (event.creator.id !== creatorId) {
            throw new ForbiddenException('You are not the creator of this event')
        }

        await this.attendeeRepo.delete({
            event: { id: eventId } 
        })

        return this.eventRepo.delete(eventId)
    }

}
