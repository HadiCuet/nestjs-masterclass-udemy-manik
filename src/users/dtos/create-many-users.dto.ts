import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyUsersDto {

    @ApiProperty({
        type: 'array',
        required: true,
        description: 'Array of user objects to be created',
        items: {
            type: 'User'
        }
    })
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    users!: CreateUserDto[];
}