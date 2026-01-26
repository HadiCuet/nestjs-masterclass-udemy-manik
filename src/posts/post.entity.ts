import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { postType } from "./enums/postType.enum";
import { postStatus } from "./enums/postStatus.enum";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { User } from "src/users/user.entity";
import { Tag } from "src/tags/tags.entity";

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

    @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
        cascade: true,
        eager: true,
    })
    metaOptions?: MetaOption;

    @ManyToOne(() => User, (user) => user.posts, {
        eager: true,
    })
    author: User;

    
    @ManyToMany(() => Tag, (tag) => tag.posts, {
        eager: true,
    })
    @JoinTable()
    tags?: Tag[];

}