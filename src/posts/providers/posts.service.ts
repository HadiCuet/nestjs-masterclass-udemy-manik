import { Body, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { Repository } from "typeorm";
import { Post } from "../post.entity";

@Injectable()
export class PostsService {

    constructor(
        // Injecting UsersService
        private readonly usersService: UsersService,

        // Injecting MetaOptionRepository
        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>,

        // Injecting PostRepository
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>
    ) {}

    public async findAll(userID: string) {
        const user = this.usersService.findOneById(userID);
        const posts = await this.postsRepository.find();
        return posts;
    }

    public async create(createPostDto: CreatePostDto) {
        let newPost = this.postsRepository.create(createPostDto);
        return await this.postsRepository.save(newPost);
    }

    public async delete(id: number) {
        await this.postsRepository.delete(id);
        return { deleted: true, id: id};
    }
}