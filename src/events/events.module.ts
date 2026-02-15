import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events.entity';
import { EventAttendee } from './events-entity.entity';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventAttendee]),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
