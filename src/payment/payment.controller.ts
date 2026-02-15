import { Body, Controller, Post, Req, Param, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import { InitPaymentDTO } from './payment.dto';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

   @Post('init')
   @Roles(UserRole.EVENTEE)
   @ApiOperation({
        summary: 'Initialize payment',
        description: 'Initializes a payment for an event and returns a payment reference'
    })
    initPayment(
        @Body() dto: InitPaymentDTO,
        @Req() req
    ) {
        return this.paymentService.initPayment(dto.eventId, req.user.userId)
    }

    @Get('verify/:reference')
    @ApiOperation({
        summary: 'Verify payment',
        description: 'Verifies a payment using the payment reference'
    })
    @ApiParam({
        name: 'reference',
        description: 'Payment reference returned from Paystack',
        example: 'paystack_ref_123456'
    })
        verifyPayment(@Param('reference') reference: string) {
            return this.paymentService.verifyPayment(reference)
        }
}
