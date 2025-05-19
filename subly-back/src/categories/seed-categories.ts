// scripts/seed-categories.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Category } from './category.entity';
import { DatabaseModule } from 'src/database/database.module';

async function seed() {
  // 1️⃣ Crée un contexte Nest minimal sur ton DatabaseModule
  const appContext = await NestFactory.createApplicationContext(DatabaseModule);

  // 2️⃣ Récupère le DataSource instancié par TypeOrmModule.forRoot()
  //    Si tu utilises @nestjs/typeorm >= 9, c'est simplement :
  const dataSource = appContext.get(DataSource);

  // 3️⃣ Utilise ton repo de Category pour seed
  const repo = dataSource.getRepository(Category);
  const seedData = [
    { name: 'food', icon: 'utensils' },
    { name: 'transport', icon: 'bus' },
    { name: 'rent', icon: 'home' },
    // …
  ];

  for (const { name, icon } of seedData) {
    const exists = await repo.findOneBy({ name });
    if (!exists) {
      await repo.save(repo.create({ name, icon }));
    }
  }

  console.log('✅ Seed terminé');
  // 4️⃣ Ferme proprement Nest
  await appContext.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
