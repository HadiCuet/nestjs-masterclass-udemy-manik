import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty } from "class-validator";

export class CreatePostMetaOptionsDto {
    @ApiProperty({
        description: "Meta option in key, value pair for post"
    })
    @IsNotEmpty()
    @IsJSON()
    metaValue: string;
}