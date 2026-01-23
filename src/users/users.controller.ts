import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get('/:id/')
    public getUsers(@Param('id', ParseIntPipe) id: number | undefined,
     @Query('offset', ParseIntPipe) offset: number | undefined,
    @Query('limit', ParseIntPipe) limit: number | undefined) {
        // console.log(params, queries);
        return `You sent a get request to users endpoints ${id}`;
    }

    @Post()
    public createUsers(@Body() requests: any) {
        console.log(requests);
        return "Your create user endpoint returns success";
    }
}
