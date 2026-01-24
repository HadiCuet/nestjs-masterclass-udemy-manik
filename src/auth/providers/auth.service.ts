import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {

    constructor(
        // Inject UsersService to avoid circular dependency
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) { }

    public logIn(username: string, password: string, id: string) {
        const user = this.usersService.findOneById(id);
        // Logic for user login
        return "Sample token-xyz-123";
    }

    public isAuth() {
        // Logic to check if user is authenticated
        return true;
    }
}
