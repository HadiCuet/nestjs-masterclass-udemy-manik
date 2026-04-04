import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    firstName!: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    lastName?: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: 'Password must contain at least one letter, one number and special character, and be at least 8 characters long',
    })
    password!: string;
}