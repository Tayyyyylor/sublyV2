// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { Category } from './category.entity';

async function bootstrapSeed(): Promise<void> {
  // 1. Monte un contexte NestJS sans serveur HTTP
  const appContext = await NestFactory.createApplicationContext(AppModule);

  // 2. Récupère l'instance TypeORM DataSource (configurée par TypeOrmModule.forRoot)
  const dataSource = appContext.get(DataSource);

  // 3. Récupère le Repository<Category>
  const categoryRepo = dataSource.getRepository(Category);

  // 4. Les données à seed (typage explicite)
  const categories: Partial<Category>[] = [
    { name: 'FOOD', icon: '🍔' },
    { name: 'TRANSPORT', icon: '🚗' },
    { name: 'HOUSING', icon: '🏠' },
    // … ajoute ici toutes tes catégories
  ];

  // 5. On boucle et on insère si inexistant
  for (const data of categories) {
    const exists = await categoryRepo.findOne({ where: { name: data.name! } });
    if (!exists) {
      const category = categoryRepo.create(data);
      await categoryRepo.save(category);
      console.log(`Seeded category: ${data.name}`);
    }
  }

  // 6. Ferme proprement le contexte NestJS
  await appContext.close();
  console.log('✅ Seeding terminé');
}

bootstrapSeed().catch((err) => {
  console.error('❌ Erreur durant le seeding :', err);
  process.exit(1);
});
