import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";

@Injectable()
export class PostsService {

    constructor(
        // Injecting UsersService
        private readonly usersService: UsersService
    ) {}

    public findAll(userID: string) {
        const user = this.usersService.findOneById(userID);
        return [
            { id: 1, title: 'First Post', content: 'This is the content of the first post', user: user },
            { id: 2, title: 'Second Post', content: 'This is the content of the second post', user: user },
            { id: 3, title: 'Third Post', content: 'This is the content of the third post', user: user },
        ];
    }
}