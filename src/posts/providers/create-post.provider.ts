import {
    BadRequestException,
    Injectable,
    NotFoundException,
    RequestTimeoutException,
} from '@nestjs/common';
import { Tag } from 'src/tags/tags.entity';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {
    constructor(
        // Injecting UsersService
        private readonly usersService: UsersService,

        private readonly tagsService: TagsService,

        // Injecting PostRepository
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
    ) {}

    public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
        let author: User | null = null;
        try {
            author = await this.usersService.findOneById(user.sub);
        } catch (error) {
            throw new RequestTimeoutException('Database request timed out', {
                description:
                    'The request to fetch the author took too long to complete.',
            });
        }
        if (!author) {
            throw new NotFoundException(`Author with ID ${user.sub} not found`);
        }
        let tags: Tag[] = [];
        try {
            tags = await this.tagsService.findMultipleTags(
                createPostDto.tags || [],
            );
        } catch (error) {
            throw error;
        }
        if (createPostDto.tags?.length != tags.length) {
            throw new BadRequestException(
                'One or more provided tag IDs are invalid, please check and try again.',
            );
        }

        let newPost = this.postsRepository.create({
            ...createPostDto,
            author: author,
            tags: tags,
        });
        try {
            return await this.postsRepository.save(newPost);
        } catch (error) {
            throw new RequestTimeoutException('Database request timed out', {
                description:
                    'The request to create a new post took too long to complete.',
            });
        }
    }
}
