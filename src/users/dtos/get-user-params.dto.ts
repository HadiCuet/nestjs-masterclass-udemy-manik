import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import { exitCode } from "process";

export class GetUserParamsDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}