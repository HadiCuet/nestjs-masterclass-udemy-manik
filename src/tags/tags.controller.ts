import { Body, Controller, Delete, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {

    constructor(
        private readonly tagsService: TagsService
    ) {}

    @Post()
    public async createTag(@Body() createTagDto: CreateTagDto) {
        return await this.tagsService.createTag(createTagDto);
    }

    @Delete()
    public async deleteTag(@Query("id", ParseIntPipe) id: number) {
        return await this.tagsService.delete(id);
    }

    @Delete('/soft-delete')
    public async softDeleteTag(@Query("id", ParseIntPipe) id: number) {
        return await this.tagsService.softRemove(id);
    }
}
