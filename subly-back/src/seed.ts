// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { Category } from './categories/category.entity';
import { Frequency, Recurrence } from 'src/recurrence/recurrence.entity';

async function bootstrapSeed() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const ds: DataSource = appContext.get(DataSource);
  const catRepo = ds.getRepository(Category);
  const recRepo = ds.getRepository(Recurrence);

  // 1) Les catégories prédéfinies
  const categories = [
    { name: 'FOOD', icon: '🍔' },
    { name: 'TRANSPORT', icon: '🚗' },
    { name: 'HOUSING', icon: '🏠' },
    // … ajoutez les vôtres
  ];

  // 2) Les récurrences prédéfinies (startDate = aujourd’hui)
  const today = new Date();
  const recurrences = [
    { frequency: Frequency.DAILY, startDate: today },
    { frequency: Frequency.WEEKLY, startDate: today },
    { frequency: Frequency.MONTHLY, startDate: today },
    { frequency: Frequency.YEARLY, startDate: today },
  ];

  // Seed catégories
  for (const data of categories) {
    const exists = await catRepo.findOne({ where: { name: data.name } });
    if (!exists) await catRepo.save(catRepo.create(data));
  }

  // Seed récurrences
  for (const data of recurrences) {
    const exists = await recRepo.findOne({
      where: { frequency: data.frequency },
    });
    if (!exists) await recRepo.save(recRepo.create(data));
  }

  await appContext.close();
  console.log('✅ Seeding terminé');
}

bootstrapSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});
