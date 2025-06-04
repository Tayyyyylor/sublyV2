import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../users/user.entity';
import { UsersModule } from '../users/user.module';

import { AuthModule } from '../auth/auth.module';

import { Category } from './category.entity';
import { CategoryModule } from './category.module';

import { Event } from '../events/event.entity';
import { Recurrence } from '../recurrence/recurrence.entity';

interface LoginResponse {
  access_token: string;
}

describe('Category Integration (GET endpoints)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let categoryRepo: Repository<Category>;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User, Category, Event, Recurrence],
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
        CategoryModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    categoryRepo = moduleFixture.get<Repository<Category>>(
      getRepositoryToken(Category),
    );

    // Créer un utilisateur de test
    const hashed = await bcrypt.hash('password123!', 10);
    const user = await userRepo.save(
      userRepo.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashed,
      }),
    );

    // Login pour obtenir le JWT
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123!' })
      .expect(200);

    jwtToken = (loginResponse.body as LoginResponse).access_token;

    // Créer des catégories de test
    const categories = [
      { name: 'FOOD', icon: '🍔', user },
      { name: 'TRANSPORT', icon: '🚗', user },
      { name: 'HOUSING', icon: '🏠', user },
    ];
    await categoryRepo.save(categories.map((cat) => categoryRepo.create(cat)));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /categories', () => {
    it('should return all categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);

      const categoryNames = (response.body as Category[])
        .map((cat: Category) => cat.name)
        .sort();
      expect(categoryNames).toEqual(['FOOD', 'HOUSING', 'TRANSPORT'].sort());

      (response.body as Category[]).forEach((category: Category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('icon');
        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.icon).toBe('string');
      });
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/categories').expect(401);
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a specific category', async () => {
      const category = await categoryRepo.findOne({ where: { name: 'FOOD' } });
      if (!category) throw new Error('Category not found');

      const response = await request(app.getHttpServer())
        .get(`/categories/${category.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: category.id,
        name: category.name,
        icon: category.icon,
      });
    });

    it('should return 404 for a non-existent ID', async () => {
      await request(app.getHttpServer())
        .get('/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      const category = await categoryRepo.findOne({ where: { name: 'FOOD' } });
      if (!category) throw new Error('Category not found');

      await request(app.getHttpServer())
        .get(`/categories/${category.id}`)
        .expect(401);
    });
  });
});
