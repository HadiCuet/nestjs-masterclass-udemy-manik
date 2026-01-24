import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamsDto } from './dtos/get-user-params.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get('/{:id}')
    @ApiOperation({ summary: 'Retrieve a list of users with optional pagination' })
    @ApiResponse({ status: 200, description: 'List of users retrieved successfully.' })
    @ApiQuery({ name: 'page',
            type: 'number',
            required: false,
            example: 0, 
            description: 'Page number for pagination' 
        })
        @ApiQuery({ name: 'limit',
            type: 'number',
            required: false,
            example: 20,
            description: 'Number of items per page for pagination' 
        })
    public getUsers(@Param() getUserParamDto: GetUserParamsDto,
                    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
                    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number) {
        return this.usersService.findAll(getUserParamDto, page, limit);
    }

    @Post()
    public createUsers(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return "Your create user endpoint returns success";
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto) {
        return "Your patch user endpoint returns success";
    }
}
