import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Event } from 'src/events/events.entity';
import { EventAttendee } from 'src/events/events-entity.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Payment,
      Event,
      EventAttendee
    ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
