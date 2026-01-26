import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUserParamsDto } from "../dtos/get-user-params.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";

@Injectable()
export class UsersService {

    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,

        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    public async createUser(createUserDto: CreateUserDto) {
        // check is user exists with same email
        const existingUser = await this.usersRepository.findOne({
            where: {email: createUserDto.email}
        });
        
        // create user
        let newUser = this.usersRepository.create(createUserDto);
        newUser = await this.usersRepository.save(newUser);

        return newUser;
    }

    public findAll(getUserParamDto: GetUserParamsDto,
        page: number,
        limit: number,
    ) {
        const isAuth = this.authService.isAuth();
        console.log('Is Authenticated: ', isAuth);
        return [
            { id: 1, name: 'John Doe', email: 'john@doe.com'},
            { id: 2, name: 'Jane Smith', email: 'jane@smith.com'},
            { id: 3, name: 'Alice Johnson', email: 'alice@johnson.com'},
        ];
    }

    public async findOneById(id: number) {
        return await this.usersRepository.findOneBy({id});
    }
}