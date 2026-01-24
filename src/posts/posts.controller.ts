import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './providers/posts.service';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Get('/{:userID}')
    public getPosts(@Param('userID') userID: string) {
        return this.postsService.findAll(userID);
    }
}
