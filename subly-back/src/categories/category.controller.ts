import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesServices: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesServices.findAll();
  }
}
