import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('/{:userID}')
    public getPosts(
        @Param('userID') userID: string,
        @Query() getPostsDto: GetPostsDto,
    ) {
        return this.postsService.findAll(userID, getPostsDto);
    }

    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post()
    public createPost(
        @Body() createPostDto: CreatePostDto,
        @ActiveUser() activeUser: ActiveUserData,
    ) {
        return this.postsService.create(createPostDto, activeUser);
    }

    @ApiOperation({ summary: 'Update an existing post' })
    @ApiResponse({ status: 200, description: 'Post updated successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Patch()
    public patchPost(@Body() patchPostDto: PatchPostDto) {
        return this.postsService.update(patchPostDto);
    }

    @Delete()
    public deletePost(@Query('id', ParseIntPipe) id: number) {
        return this.postsService.delete(id);
    }
}
