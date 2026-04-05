import {
    BadRequestException,
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    RequestTimeoutException,
} from '@nestjs/common';
import { GetUserParamsDto } from '../dtos/get-user-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserProvider } from './find-user.provider';

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,

        @InjectRepository(User)
        private usersRepository: Repository<User>,

        private readonly usersCreateManyProvider: UsersCreateManyProvider,

        private readonly createUserProvider: CreateUserProvider,

        private readonly findUserProvider: FindUserProvider,
    ) {}

    public async createUser(createUserDto: CreateUserDto) {
        return await this.createUserProvider.createUser(createUserDto);
    }

    public findAll(
        getUserParamDto: GetUserParamsDto,
        page: number,
        limit: number,
    ) {
        const isAuth = this.authService.isAuth();
        console.log('Is Authenticated: ', isAuth);
        if (!isAuth) {
            // Custom Exception thrown for Unauthorized Access
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'You must be logged in to access this resource',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
        return [
            { id: 1, name: 'John Doe', email: 'john@doe.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@smith.com' },
            { id: 3, name: 'Alice Johnson', email: 'alice@johnson.com' },
        ];
    }

    public async findOneById(id: number) {
        try {
            return await this.usersRepository.findOneBy({ id });
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process request at this time',
                {
                    description:
                        'The request to find user by ID took too long to complete.',
                },
            );
        }
    }

    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        return await this.usersCreateManyProvider.createMany(
            createManyUsersDto,
        );
    }

    public async findOneByEmail(email: string) {
        return await this.findUserProvider.findOneUserByEmail(email);
    }
}
