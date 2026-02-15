import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {}

    create(data: Partial<User>) {
        return this.userRepo.create(data);
    }

    save(user: User) {
        return this.userRepo.save(user);
    }

    findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }

    async findByEmailWithPassword(email: string) {
        return this.userRepo
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();
    }


    findById(id: string) {
        return this.userRepo.findOne({ where: { id } });
    }
}
