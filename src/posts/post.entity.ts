import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { postType } from "./enums/postType.enum";
import { postStatus } from "./enums/postStatus.enum";
import { CreatePostMetaOptionsDto } from "../meta-options/dtos/create-post-meta-options.dto";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false,
        length: 512
    })
    title: string;

    @Column({
        type: "enum",
        enum: postType,
        nullable: false,
        default: postType.POST,
    })
    postType: postType;

    @Column({
        type: "varchar",
        nullable: false,
        length: 256,
        unique: true
    })
    slug: string;

    @Column({
        type: "enum",
        enum: postStatus,
        nullable: false,
        default: postStatus.DRAFT,
    })
    postStatus: postStatus;

    @Column({
        type: "text",
        nullable: true
    })
    content?: string;

    @Column({
        type: "text",
        nullable: true
    })
    schema?: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 1024
    })
    featuredImageUrl?: string;


    @Column({
        type: "timestamp", // 'datetime' in mysql
        nullable: true
    })
    publishedOn?: Date;

    // MARK: relational database
    tags?: string[];
    metaOptions?: CreatePostMetaOptionsDto[];
}