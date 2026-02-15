import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAttendee } from 'src/events/events-entity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventAttendee])
  ],
  controllers: [TicketsController]
})
export class TicketsModule {}
