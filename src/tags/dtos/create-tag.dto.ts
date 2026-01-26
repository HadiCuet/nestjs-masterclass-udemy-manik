import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, Matches, MinLength, IsOptional, IsJSON } from "class-validator";

export class CreateTagDto {
    @ApiProperty({
        description: 'Name of the tag',
        example: 'Technology'
    })
    @IsString()
    @MinLength(3)
    @MaxLength(512)
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Slug for the tag, can only contain lowercase letters, numbers, and hyphens',
        example: 'technology'
    })
    @IsString()
    @MinLength(3)
    @MaxLength(256)
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    slug: string;

    @ApiPropertyOptional({
        description: 'Description of the tag',
        example: 'Posts related to technology and gadgets',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Schema of the tag in JSON format',
        example: '{"type": "object", "properties": {"name": {"type": "string"}, "slug": {"type": "string"}}}',
        required: false
    })
    @IsJSON()
    @IsOptional()
    schema?: string;

    @ApiPropertyOptional({
        description: 'URL of the featured image for the tag',
        example: 'https://example.com/images/technology.jpg',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(1024)
    featuredImageUrl?: string;
}