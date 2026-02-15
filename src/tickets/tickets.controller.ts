import { BadRequestException, Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import { EventAttendee } from 'src/events/events-entity.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto'
import 'dotenv/config'
import { InjectRepository } from '@nestjs/typeorm';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiBody } from '@nestjs/swagger'


@ApiTags('Tickets')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
    constructor(
        @InjectRepository(EventAttendee)
        private attendeeRepo: Repository<EventAttendee>
    ) {}

    @Get(':eventId/qr')
    @Roles(UserRole.EVENTEE)
        async getMyQr(
            @Req() req,
            @Param('eventId') eventId: string 
        ) {
            const attendee = await this.attendeeRepo.findOne({
                where: {
                    event: { id: eventId },
                    user: { id: req.user.userId}
                }
            })

            if (!attendee) {
                throw new NotFoundException('No ticket found')
            }

            return {
                attendeeId: attendee.id,
                eventId,
                qrHash: attendee.qrHash
            }
        }
        

    @Post('scan')
    @ApiOperation({
        summary: 'Scan event ticket QR',
        description: 'Validates a ticket QR and marks it as used'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                attendeeId: { example: 'uuid-string' },
                qrHash: { example: 'hashed-qr-value' }
            }
        }
    })
    @Roles(UserRole.CREATOR)
    @Throttle({
        scan: { 
            limit: 5, 
            ttl: 60 
        }
    })
        async scanText(
            @Body() body: { attendeeId: string, qrHash: string },
            @Req() req
        ) {
            const attendee = await this.attendeeRepo.findOne({
                where: { id: body.attendeeId },
                relations: ['event', 'event.creator']
            })

            if (!attendee) {
                throw new NotFoundException('Ticket not found')
            }

            if (attendee.event.creator.id !== req.user.userId) {
                throw new ForbiddenException('Not your event')
            }

            if (attendee.scannedAt) {
                throw new BadRequestException('Ticket already used')
            }

            const expectedHash = crypto
                .createHmac('sha256', process.env.QR_SECRET!)
                .update(attendee.id)
                .digest('hex')

            if (expectedHash !== body.qrHash) {
                throw new UnauthorizedException('Invalid QR')
            }

            attendee.scannedAt = new Date()
            await this.attendeeRepo.save(attendee)

            return {
                success: true,
                message: 'Ticket Valid',
                user: attendee.user.username
            }
        }
}
