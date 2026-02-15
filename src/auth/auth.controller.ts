import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
        @ApiOperation({ summary: 'Login a user' })
        @ApiBody({ type: LoginDto })
        @ApiResponse({ status: 200, description: 'Login successful' })
        @ApiResponse({ status: 401, description: 'Invalid credentials' })
    login (@Body() body: LoginDto) {
        return this.authService.login(body)
    }

    @Post('signup')
        @ApiOperation({ summary: 'Create a new Account' })
        @ApiBody({ type: SignupDto })
        @ApiResponse({ status: 200, description: 'User created successfully' })
        @ApiResponse({ status: 401, description: 'Invalid input' })
    signup (@Body() body: SignupDto) {
        return this.authService.signup(body)
    } 
}
