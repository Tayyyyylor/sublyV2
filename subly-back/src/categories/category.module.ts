import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryController } from './category.controller';
import { CategoriesService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  controllers: [CategoryController],
  exports: [CategoriesService],
})
export class CategoryModule {}
