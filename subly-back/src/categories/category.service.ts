import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { DEFAULT_CATEGORIES } from './default-categories';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async seedIfEmpty() {
    const count = await this.categoryRepository.count();
    if (count === 0) {
      for (const name of DEFAULT_CATEGORIES) {
        await this.create(name);
      }
      console.log('[Seed] Catégories par défaut insérées.');
    }
  }

  findAll() {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  // 🔍 Récupère une catégorie par son ID
  findOneById(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  // 🔎 Récupère une catégorie par son nom
  findByName(name: string) {
    return this.categoryRepository.findOne({ where: { name } });
  }

  // ➕ Crée une catégorie
  async create(name: string) {
    const existing = await this.findByName(name);
    if (existing) return existing;

    const category = this.categoryRepository.create({ name });
    return this.categoryRepository.save(category);
  }
}
