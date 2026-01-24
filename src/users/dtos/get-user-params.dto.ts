import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import { exitCode } from "process";

export class GetUserParamsDto {
    @ApiPropertyOptional({
        description: 'The ID of the user to retrieve',
        example: 12345
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}