import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
    @Get('/{:id}')
    public getUsers(@Param('id', ParseIntPipe) id: number | undefined,
                    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number | undefined,
                    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number | undefined) {
        // console.log(params, queries);
        console.log(typeof id, id);
        console.log(typeof page, page);
        console.log(typeof limit, limit);
        return `You sent a get request to users endpoints ${id}`;
    }

    @Post()
    public createUsers(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return "Your create user endpoint returns success";
    }
}
