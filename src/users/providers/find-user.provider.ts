import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindUserProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    public async findOneUserByEmail(email: string): Promise<User> {
        let user: User | null = null;
        try {
            user = await this.usersRepository.findOne({
                where: { email: email },
            });
        } catch (error) {
            throw new Error('Database request timed out while fetching user');
        }
        if (!user) {
            throw new UnauthorizedException(
                'Could not find user with the provided email',
            );
        }
        return user;
    }
}
