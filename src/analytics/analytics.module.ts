import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/events.entity';
import { Payment } from 'src/payment/payment.entity';
import { EventAttendee } from 'src/events/events-entity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      Payment,
      EventAttendee
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
