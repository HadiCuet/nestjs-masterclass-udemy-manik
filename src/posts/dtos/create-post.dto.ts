import {
    IsArray,
    IsEnum,
    IsISO8601,
    IsJSON,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    ValidateNested,
    MinLength,
    MaxLength,
    IsInt,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({
        description: 'Title of the post',
        example: 'My First Post',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(512)
    title: string;

    @ApiProperty({
        description:
            'Type of the post, possible values: post, page, story, series',
        example: postType.POST,
        enum: postType,
    })
    @IsEnum(postType)
    @IsNotEmpty()
    postType: postType;

    @ApiProperty({
        description:
            'Slug for the post, can only contain lowercase letters, numbers, and hyphens',
        example: 'my-first-post',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
            'Slug can only contain lowercase letters, numbers, and hyphens',
    })
    @MaxLength(256)
    slug: string;

    @ApiProperty({
        description:
            'Status of the post, possible values: draft, scheduled, review, published',
        example: postStatus.DRAFT,
        enum: postStatus,
    })
    @IsEnum(postStatus)
    @IsNotEmpty()
    status: postStatus;

    @ApiPropertyOptional({
        description: 'Content of the post',
        example: 'This is the content of my first post',
    })
    @IsString()
    @IsOptional()
    @MinLength(10)
    content?: string;

    @ApiPropertyOptional({
        description: 'Schema of the post in JSON format',
        example:
            '{"type": "object", "properties": {"title": {"type": "string"}, "content": {"type": "string"}}}',
    })
    @IsJSON()
    @IsOptional()
    schema?: string;

    @ApiPropertyOptional({
        description: 'Featured image URL of the post',
        example: 'https://example.com/images/my-first-post.jpg',
    })
    @IsUrl()
    @IsOptional()
    @MaxLength(1024)
    featuredImageUrl?: string;

    @ApiPropertyOptional({
        description: 'Published date of the post in ISO 8601 format',
        example: '2024-08-15T14:30:00Z',
    })
    @IsISO8601()
    @IsOptional()
    publishedOn?: string;

    @ApiPropertyOptional({
        description: 'Array of tag IDs associated with the post',
        example: [1, 2, 3],
    })
    @IsOptional()
    @IsArray()
    @IsInt({
        each: true,
    })
    tags?: number[];

    @ApiPropertyOptional({
        type: 'string',
        required: false,
        items: {
            type: 'object',
            properties: {
                metaValue: {
                    type: 'json',
                    description: 'Meta option is a json object',
                    example:
                        '{"sidebarEnabled": true, "showAuthorInfo": false}',
                },
            },
        },
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreatePostMetaOptionsDto)
    metaOptions?: CreatePostMetaOptionsDto | undefined;
}
