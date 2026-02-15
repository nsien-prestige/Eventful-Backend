import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class InitPaymentDTO {
    @ApiProperty({
        description: 'ID of the event to pay for',
        example: 'f3b2a1c9-1234-4567-890a-bcdef1234567'
    })
    @IsUUID()
    eventId: string
}