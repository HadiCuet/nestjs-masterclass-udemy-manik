import { Body, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { Repository } from "typeorm";
import { Post } from "../post.entity";
import { TagsService } from "src/tags/providers/tags.service";
import { PatchPostDto } from "../dtos/patch-post.dto";

@Injectable()
export class PostsService {

    constructor(
        // Injecting UsersService
        private readonly usersService: UsersService,

        private readonly tagsService: TagsService,

        // Injecting PostRepository
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>
    ) {}

    public async findAll(userID: string) {
        return await this.postsRepository.find({
            relations: {
                metaOptions: true
            }
        });
    }

    public async create(createPostDto: CreatePostDto) {
        let author = await this.usersService.findOneById(createPostDto.authorId);
        if (author) {
            let tags = await this.tagsService.findMultipleTags(createPostDto.tags || []);
            
            let newPost = this.postsRepository.create({
                ...createPostDto,
                author: author,
                tags: tags
            });
            return await this.postsRepository.save(newPost);
        }
    }

    public async update(patchPostDto: PatchPostDto) {
        let tags = await this.tagsService.findMultipleTags(patchPostDto.tags || []);

        let post = await this.postsRepository.findOneBy({id: patchPostDto.id});
        if (post) {
            post.title = patchPostDto.title ?? post.title;
            post.slug = patchPostDto.slug ?? post.slug;
            post.postType = patchPostDto.postType ?? post.postType;
            post.postStatus = patchPostDto.status ?? post.postStatus;
            post.content = patchPostDto.content ?? post.content;
            post.schema = patchPostDto.schema ?? post.schema;
            post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
            post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;
            post.tags = tags;
            
            return await this.postsRepository.save(post);
        }
    }

    public async delete(id: number) {
        await this.postsRepository.delete(id);
        return { deleted: true, id: id};
    }
}