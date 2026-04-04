import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { GetUserParamsDto } from "../dtos/get-user-params.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";

@Injectable()
export class UsersService {

    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,

        @InjectRepository(User)
        private usersRepository: Repository<User>,

        private readonly usersCreateManyProvider: UsersCreateManyProvider
    ) { }

    public async createUser(createUserDto: CreateUserDto) {
        // check is user exists with same email
        let existingUser: User | null = null;
        try {
            existingUser = await this.usersRepository.findOne({
                where: { email: createUserDto.email }
            });
        } catch (error) {
            throw new RequestTimeoutException('Database request timed out', {
                description: 'The request to check for existing user took too long to complete.',
            });
        }

        if (existingUser) {
            throw new BadRequestException(`User with email ${createUserDto.email} already exists`, {
                description: "Cannot create user with duplicate email addresses.",
            });
        }

        // create user
        let newUser = this.usersRepository.create(createUserDto);
        try {
            newUser = await this.usersRepository.save(newUser);
        } catch (error) {
            throw new RequestTimeoutException('Database request timed out', {
                description: 'The request to create a new user took too long to complete.',
            });
        }

        return newUser;
    }

    public findAll(getUserParamDto: GetUserParamsDto,
        page: number,
        limit: number,
    ) {
        const isAuth = this.authService.isAuth();
        console.log('Is Authenticated: ', isAuth);
        if (!isAuth) {
            // Custom Exception thrown for Unauthorized Access
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'You must be logged in to access this resource',
            },
                HttpStatus.UNAUTHORIZED);
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
            throw new RequestTimeoutException("Unable to process request at this time", {
                description: "The request to find user by ID took too long to complete.",
            });
        }
    }

    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        return await this.usersCreateManyProvider.createMany(createManyUsersDto);
    }
}