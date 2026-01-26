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

    public findAll(userID: string) {
        const user = this.usersService.findOneById(userID);
        return [
            { id: 1, title: 'First Post', content: 'This is the content of the first post', user: user },
            { id: 2, title: 'Second Post', content: 'This is the content of the second post', user: user },
            { id: 3, title: 'Third Post', content: 'This is the content of the third post', user: user },
        ];
    }

    public async create(createPostDto: CreatePostDto) {
        // create meta options if exists
        let metaOption = createPostDto.metaOptions 
        ? this.metaOptionRepository.create(createPostDto.metaOptions) 
        : null;

        if (metaOption) {
            await this.metaOptionRepository.save(metaOption);
        }


        // create post with meta options
        let newPost = this.postsRepository.create(createPostDto);
        if (metaOption) {
            newPost.metaOptions = metaOption;
        }
        // return post to users
        return await this.postsRepository.save(newPost);
    }
}