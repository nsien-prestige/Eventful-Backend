import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Tech Conference 2024' })
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'A day of innovation and networking' })
    summary: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Join us for an amazing day...' })
    description?: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'TechCorp Inc' })
    organizer: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Conference' })
    eventType?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Technology' })
    category?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'https://...' })
    imageUrl?: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({ example: '2024-12-15T09:00:00Z' })
    date: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({ example: '2024-12-15T17:00:00Z' })
    endDate?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'venue' })
    locationType?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123 Main St, Lagos' })
    venueAddress?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'https://zoom.us/j/...' })
    meetingLink?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: 6.5244 })
    latitude?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: 3.3792 })
    longitude?: number;

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 100 })
    capacity?: number;

    @IsOptional()
    @IsArray()
    @ApiProperty({
        example: [{
            title: 'Opening Keynote',
            startTime: '09:00 AM',
            endTime: '10:30 AM',
            host: 'John Doe',
            description: 'Welcome speech'
        }]
    })
    agenda?: any[];

    @IsOptional()
    @IsArray()
    @ApiProperty({
        example: [{
            name: 'Early Bird',
            price: '50.00',
            quantity: '100',
            isFree: false
        }]
    })
    tickets?: any[]; 
}