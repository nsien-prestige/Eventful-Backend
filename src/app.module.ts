import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from './payment/payment.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CacheModule } from '@nestjs/cache-manager'
import { TicketsModule } from './tickets/tickets.module';
import { NotificationsModule } from './notifications/notifications.module';
import * as redisStore from 'cache-manager-ioredis-yet'
import 'dotenv/config'
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || undefined,

      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'eventful',

      ssl: process.env.DATABASE_URL
        ? { rejectUnauthorized: false }
        : false,

      autoLoadEntities: true,
      synchronize: true,
    }),

    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60,
          limit: 100
        }
      ]
    }),

    ScheduleModule.forRoot(),

    AuthModule,
    EventsModule,
    UsersModule,
    PaymentModule,
    WebhooksModule,
    AnalyticsModule,
    TicketsModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
