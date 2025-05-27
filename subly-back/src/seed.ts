// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { Category } from './categories/category.entity';
import { Frequency, Recurrence } from 'src/recurrence/recurrence.entity';
import { Event } from './events/event.entity';

async function bootstrapSeed() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const ds: DataSource = appContext.get(DataSource);
  const catRepo = ds.getRepository(Category);
  const recRepo = ds.getRepository(Recurrence);
  const eventRepo = ds.getRepository(Event);

  // 1) Les catégories prédéfinies
  const categories = [
    { name: 'Nourriture', icon: '🍽️' },
    { name: 'Transport', icon: '🚌' },
    { name: 'Loyer', icon: '🏘️' },
    { name: 'Streaming', icon: '📺' },
    { name: 'Abonnements', icon: '📱' },
    { name: 'Animaux', icon: '🐾' },
    { name: 'Assurance', icon: '🛡️' },
    { name: 'Autre', icon: '📌' },
    { name: 'Banque', icon: '💳' },
    { name: 'Beauté', icon: '✨' },
    { name: 'Cadeaux', icon: '🎁' },
    { name: 'Café', icon: '☕' },
    { name: 'Carburant', icon: '⛽' },
    { name: 'Courses', icon: '🛒' },
    { name: 'Dons', icon: '🤝' },
    { name: 'Éducation', icon: '📚' },
    { name: 'Électronique', icon: '💻' },
    { name: 'Entretien', icon: '🔧' },
    { name: 'Épargne', icon: '💰' },
    { name: 'Factures', icon: '📄' },
    { name: 'Santé', icon: '⚕️' },
    { name: 'Vêtements', icon: '👕' },
    { name: 'Voyages', icon: '✈️' },
    { name: 'Sport', icon: '⚽' },
    { name: 'Impots', icon: '📊' },
    { name: 'Internet', icon: '🌐' },
    { name: 'Jeux', icon: '🎮' },
    { name: 'Loisirs', icon: '🎨' },
    { name: 'Maison', icon: '🏠' },
    { name: 'Musique', icon: '🎵' },
    { name: 'Restaurants', icon: '🍴' },
    { name: 'Salaires', icon: '💵' },
    { name: 'Gains autres', icon: '📈' },
  ];

  // 2) Les récurrences prédéfinies (startDate = aujourd'hui)
  const recurrences = [
    { frequency: Frequency.ONCE },
    { frequency: Frequency.DAILY },
    { frequency: Frequency.WEEKLY },
    { frequency: Frequency.MONTHLY },
    { frequency: Frequency.QUARTERLY },
    { frequency: Frequency.YEARLY },
  ];

  // Mettre à jour les catégories existantes et créer les nouvelles
  for (const data of categories) {
    const existing = await catRepo.findOne({ where: { name: data.name } });
    if (existing) {
      await catRepo.update(existing.id, { icon: data.icon });
    } else {
      await catRepo.save(catRepo.create(data));
    }
  }

  // Gérer les catégories obsolètes
  const existingCategories = await catRepo.find();
  const obsoleteCategories = existingCategories.filter(
    (existing) => !categories.find((c) => c.name === existing.name),
  );

  if (obsoleteCategories.length > 0) {
    // Trouver la catégorie "Autre"
    const autreCategory = await catRepo.findOne({ where: { name: 'Autre' } });

    if (autreCategory) {
      // Réassigner tous les événements des catégories obsolètes à "Autre"
      for (const obsoleteCat of obsoleteCategories) {
        await eventRepo.update(
          { categoryId: obsoleteCat.id },
          { categoryId: autreCategory.id },
        );
      }

      // Maintenant on peut supprimer les catégories obsolètes
      await catRepo.remove(obsoleteCategories);
    }
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
