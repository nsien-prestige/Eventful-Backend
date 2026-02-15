import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength } from "class-validator"

export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: 'john@example.com' })
    email: string

    @IsString()
    @MinLength(6)
    @ApiProperty({ example: 'password123' })
    password: string
}