import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUserParamsDto } from "../dtos/get-user-params.dto";
import { AuthService } from "src/auth/providers/auth.service";

@Injectable()
export class UsersService {

    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

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

    public findOneById(id: string) {
        return { id: id, name: 'John Doe', email: 'john@doe.com'}
    }
}