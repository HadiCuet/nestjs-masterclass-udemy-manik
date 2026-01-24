import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostMetaOptionsDto {
    @ApiProperty({
        description: 'Key for the meta option in string format',
        example: 'seoTitle'
    })
    @IsString()
    @IsNotEmpty()
    key: string;

    @ApiProperty({
        description: 'Value for the meta option, can be of any type',
        example: 'My First Post - Learn NestJS'
    })
    @IsNotEmpty()
    value: any;
}