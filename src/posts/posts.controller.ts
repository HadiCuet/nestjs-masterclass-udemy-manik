import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Get('/{:userID}')
    public getPosts(@Param('userID') userID: string) {
        return this.postsService.findAll(userID);
    }


    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post()
    public createPost(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }


    @ApiOperation({ summary: 'Update an existing post' })
    @ApiResponse({ status: 200, description: 'Post updated successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Patch()
    public patchPost(@Body() patchPostDto: PatchPostDto) {
        return "Patch Post Endpoint";
    }
}
