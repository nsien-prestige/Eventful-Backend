import { IsEmail, IsEnum, IsString, MinLength } from "class-validator"
import { UserRole } from "../enums/role.enum"
import { ApiProperty } from "@nestjs/swagger"

export class SignupDto {
    @IsEmail()
    @ApiProperty({ example: 'john@example.com' })
    email: string

    @IsString()
    @MinLength(6)
    @ApiProperty({ example: 'password123' })
    password: string

}