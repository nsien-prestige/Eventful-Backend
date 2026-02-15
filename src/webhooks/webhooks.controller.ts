import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { PaymentService } from 'src/payment/payment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
    constructor(private paymentService: PaymentService) {}

    @Post()
    @ApiOperation({
        summary: 'Paystack webhook endpoint',
        description:
            'Receives Paystack payment events. This endpoint is called by Paystack servers, not clients.'
})
        handlePaystackWebhook(
            @Req() req,
            @Body() payload: any,
            @Headers('x-paystack-signature') signature: string
        ) {
            return this.paymentService.handlePaystackWebhook(payload, signature, req.rawBody)
        }
}
