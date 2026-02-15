import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt'
import { UserRole } from './enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async signup(dto: SignupDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Email already in use');
        }

        const username = dto.email.split('@')[0] || dto.email;
        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const user = this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            roles: [UserRole.EVENTEE],
            username
        });

        const saved = await this.usersService.save(user);
        return { access_token: this.generateToken(saved) };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmailWithPassword(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password)

        if (!isMatch) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        return { access_token: this.generateToken(user) };
    }

    generateToken(user: User) {
        const payload = { 
            id: user.id, 
            email: user.email,
            roles: user.roles
        }

        return this.jwtService.sign(payload)
    }
}
