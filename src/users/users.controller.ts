import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get logged-in user profile' })
    @ApiResponse({
        status: 200,
        description: 'Returns the authenticated user profile'
    })
    @Get('profile')
        getProfile(@Req() req) {
            console.log('REQ.USER:', req.user);
            return req.user
        }
}
