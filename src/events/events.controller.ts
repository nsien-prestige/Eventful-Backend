import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateEventDto } from 'src/events/create-event.dto';
import { UserRole } from "../auth/enums/role.enum"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


@ApiTags('Events')
@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Post('create')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CREATOR, UserRole.EVENTEE)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Create an event',
        description: 'Allows a creator to create a new event'
    })
        createEvent(
            @Body() dto: CreateEventDto,
            @Req() req,
        ) {
            return this.eventsService.create(dto, req.user.userId)
        }


    @Post(':id/attend')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EVENTEE)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Attend an event',
        description: 'Allows an eventee to attend an event'
    })
    @ApiParam({
        name: 'id',
        description: 'Event ID',
        example: 'f3b2a1c9-1234-4567-890a-bcdef1234567'
    })
        attendEvent(
            @Param('id') eventId: string,
            @Req() req
        ) {
            return this.eventsService.attendEvent(eventId, req.user.userId)
        }


    @Get('my-events')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CREATOR)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get my events',
        description: 'Returns events created by the logged-in creator'
    })
        getEvents(@Req() req) {
            return this.eventsService.findByCreator(req.user.userId)
        }


    @Get()
    @ApiOperation({
        summary: 'Get all events',
        description: 'Returns all available events'
    })
        getAllEvents(@Req() req) {
            return this.eventsService.findAll()
        }


    @Get(':id/attendees')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CREATOR)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get event attendees',
        description: 'Returns attendees for an event owned by the creator'
    })
    @ApiParam({
        name: 'id',
        description: 'Event ID',
        example: 'f3b2a1c9-1234-4567-890a-bcdef1234567'
    })
        getEventAttendees(
            @Param('id') eventId: string,
            @Req() req
        ) {
            return this.eventsService.getAttendees(eventId, req.user.userId)
        }


    @Get(':publicId')
    @ApiOperation({
        summary: 'Get event by public ID',
        description: 'Returns public event details (no authentication required)'
    })
    @ApiParam({
        name: 'publicId',
        description: 'Public event identifier',
        example: 'tech-meetup-lagos-2026'
    })
        getEventByPublicId(@Param('publicId') publicId: string) {
            return this.eventsService.findByPublicId(publicId)
        }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CREATOR)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Delete event by Id',
        description: "Deletes a particular event by it's event Id"
    })
    @ApiParam({
        name: 'id',
        description: 'Event ID',
        example: 'f3b2a1c9-1234-4567-890a-bcdef1234567'
    })
    deleteEvent(@Param('id') id: string, @Req() req) {
        return this.eventsService.delete(id, req.user.userId);
    }

}
