import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { Tag } from '../tags.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {

    constructor(
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>,
    ) {}

    public async createTag(createTagDto: CreateTagDto) {
        let newTag = this.tagsRepository.create(createTagDto);
        return await this.tagsRepository.save(newTag);
    }

    public async findMultipleTags(tags: number[]) {
        return await this.tagsRepository.find({
            where: {id: In(tags)}
        });
    }

    public async delete(id: number) {
        await this.tagsRepository.delete(id);
        return { deleted: true, id: id};
    }

    public async softRemove(id: number) {
        await this.tagsRepository.softDelete(id);
        return { softDeleted: true, id: id};
    }
}
