import {
    BadRequestException,
    Body,
    Injectable,
    NotFoundException,
    RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tags.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

@Injectable()
export class PostsService {
    constructor(
        // Injecting UsersService
        private readonly usersService: UsersService,

        private readonly tagsService: TagsService,

        // Injecting PostRepository
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,

        // Injecting PaginationProvider
        private readonly paginationProvider: PaginationProvider,
    ) {}

    public async findAll(
        userID: string,
        postQuery: GetPostsDto,
    ): Promise<Paginated<Post>> {
        return await this.paginationProvider.paginateQuery(
            {
                limit: postQuery.limit,
                page: postQuery.page,
            },
            this.postsRepository,
        );
    }

    public async create(createPostDto: CreatePostDto) {
        let author: User | null = null;
        try {
            author = await this.usersService.findOneById(
                createPostDto.authorId,
            );
        } catch (error) {
            throw new RequestTimeoutException('Database request timed out', {
                description:
                    'The request to fetch the author took too long to complete.',
            });
        }
        if (!author) {
            throw new NotFoundException(
                `Author with ID ${createPostDto.authorId} not found`,
            );
        }
        let tags: Tag[] = [];
        try {
            tags = await this.tagsService.findMultipleTags(
                createPostDto.tags || [],
            );
        } catch (error) {
            throw error;
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

    public async update(patchPostDto: PatchPostDto) {
        let tags: Tag[] = [];
        let post: Post | null = null;

        try {
            tags = await this.tagsService.findMultipleTags(
                patchPostDto.tags || [],
            );
        } catch (error) {
            throw new RequestTimeoutException('Database request time out');
        }

        // number of tags need to be equal
        if (tags.length != patchPostDto.tags?.length) {
            throw new BadRequestException('Please check your tag ids');
        }

        try {
            post = await this.postsRepository.findOneBy({
                id: patchPostDto.id,
            });
        } catch (error) {
            throw new RequestTimeoutException('Database request time out');
        }
        if (!post) {
            throw new BadRequestException('Post not exist in Database');
        }
        post.title = patchPostDto.title ?? post.title;
        post.slug = patchPostDto.slug ?? post.slug;
        post.postType = patchPostDto.postType ?? post.postType;
        post.postStatus = patchPostDto.status ?? post.postStatus;
        post.content = patchPostDto.content ?? post.content;
        post.schema = patchPostDto.schema ?? post.schema;
        post.featuredImageUrl =
            patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
        post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;
        post.tags = tags;

        try {
            return await this.postsRepository.save(post);
        } catch (error) {
            throw new BadRequestException('Database request time out');
        }
    }

    public async delete(id: number) {
        await this.postsRepository.delete(id);
        return { deleted: true, id: id };
    }
}
