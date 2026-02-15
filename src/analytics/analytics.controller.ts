import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth('access-token')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CREATOR)
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) {}

    @Get('creator/overview')
    @ApiOperation({
        summary: 'Get creator analytics overview',
        description: 'Returns high-level analytics for the logged-in creator'
    })
        createOverview(@Req() req) {
            return this.analyticsService.creatorOverview(req.user.userId)
        }

    @Get('event/:eventId')
    @ApiOperation({
        summary: 'Get analytics for a specific event',
        description: 'Returns analytics for an event owned by the logged-in creator'
    })
    @ApiParam({
        name: 'eventId',
        description: 'ID of the event',
        example: 'f3b2a1c9-1234-4567-890a-bcdef1234567'
    })
        eventAnalytics(
            @Param('eventId') eventId: string,
            @Req() req
        ) {
            return this.analyticsService.eventAnalytics(eventId, req.user.userId)
        }

}  
