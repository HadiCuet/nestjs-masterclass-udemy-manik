import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';

@Module({
  controllers: [TagsController],
  exports: []
})
export class TagsModule {}
