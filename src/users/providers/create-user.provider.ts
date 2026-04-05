import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider,
    ) {}

    public async createUser(createUserDto: CreateUserDto) {
        // check is user exists with same email
        let existingUser: User | null = null;
        try {
            existingUser = await this.usersRepository.findOne({
                where: { email: createUserDto.email },
            });
        } catch (error) {
            throw new RequestTimeoutException('Database request timed out', {
                description:
                    'The request to check for existing user took too long to complete.',
            });
        }

        if (existingUser) {
            throw new BadRequestException(
                `User with email ${createUserDto.email} already exists`,
                {
                    description:
                        'Cannot create user with duplicate email addresses.',
                },
            );
        }

        // create user
        let newUser = this.usersRepository.create({
            ...createUserDto,
            password: await this.hashingProvider.hashPassword(
                createUserDto.password,
            ),
        });
        try {
            newUser = await this.usersRepository.save(newUser);
        } catch (error) {
            throw new RequestTimeoutException('Database request timed out', {
                description:
                    'The request to create a new user took too long to complete.',
            });
        }

        return newUser;
    }
}
