// src/events/event.integration.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../users/user.entity';
import { UsersModule } from '../users/user.module';

import { AuthModule } from '../auth/auth.module';

import { Category } from '../categories/category.entity';
import { CategoryModule } from '../categories/category.module';

import { Recurrence, Frequency } from '../recurrence/recurrence.entity';
import { RecurrenceModule } from '../recurrence/recurrence.module';

import { Event, EventType } from './event.entity';
import { EventsModule } from './event.module';

interface LoginResponse {
  access_token: string;
}

interface EventResponse {
  id: string;
  type: EventType;
  name: string;
  amount: number;
  recurrence: {
    id: string;
    frequency: Frequency;
  };
  category: {
    id: string;
    name: string;
    icon: string;
  };
  userId: string;
}

describe('Event Integration (CRUD endpoints)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let categoryRepo: Repository<Category>;
  let recurrenceRepo: Repository<Recurrence>;
  let eventRepo: Repository<Event>;
  let jwtToken: string;
  let savedCategory: Category;
  let savedRecurrence: Recurrence;
  let seededEvent: Event;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User, Category, Recurrence, Event],
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
        CategoryModule,
        RecurrenceModule,
        EventsModule,
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
    recurrenceRepo = moduleFixture.get<Repository<Recurrence>>(
      getRepositoryToken(Recurrence),
    );
    eventRepo = moduleFixture.get<Repository<Event>>(getRepositoryToken(Event));

    // Create and hash test user
    const hashed = await bcrypt.hash('password123!', 10);
    const user = await userRepo.save(
      userRepo.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashed,
      }),
    );

    // Login to obtain JWT
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123!' })
      .expect(200);
    jwtToken = (loginRes.body as LoginResponse).access_token;

    savedCategory = await categoryRepo.save(
      categoryRepo.create({
        name: 'FOOD',
        icon: '🍔',
        user,
      } as DeepPartial<Category>),
    );

    // 4) Seed : créer une récence (sans forcer l'ID)
    const now = new Date();
    savedRecurrence = await recurrenceRepo.save(
      recurrenceRepo.create({
        frequency: Frequency.MONTHLY,
        startDate: now,
      } as DeepPartial<Recurrence>),
    );

    // 5) Seed : créer un événement initial pour les tests GET/PATCH/DELETE
    seededEvent = await eventRepo.save(
      eventRepo.create({
        type: EventType.EXPENSE,
        name: 'Initial Event',
        amount: 10.0,
        startDate: now,
        recurrenceId: savedRecurrence.id,
        categoryId: savedCategory.id,
        userId: user.id,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /events', () => {
    it('should create a new event', async () => {
      const payload = {
        type: EventType.EXPENSE,
        name: 'Test Event',
        amount: 42.5,
        startDate: new Date().toISOString(),
        categoryId: savedCategory.id,
        recurrenceId: savedRecurrence.id,
      };

      const res = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(payload)
        .expect(201);

      const responseBody = res.body as EventResponse;
      expect(responseBody).toMatchObject({
        id: expect.any(String) as string,
        type: payload.type,
        name: payload.name,
        amount: payload.amount,
        recurrence: {
          id: savedRecurrence.id,
          frequency: savedRecurrence.frequency,
        },
        category: {
          id: savedCategory.id,
          name: savedCategory.name,
          icon: savedCategory.icon,
        },
        userId: expect.any(String) as string,
      });

      // Verify saved in repository
      const saved = await eventRepo.findOne({ where: { id: responseBody.id } });
      if (!saved) {
        throw new Error('Event not found after creation');
      }
      expect(saved.name).toBe('Test Event');
    });

    it('should return 400 for invalid payload', async () => {
      // Missing required fields
      const badPayload = { name: '', amount: -5 };
      await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(badPayload)
        .expect(400);
    });

    it('should return 401 for missing token', async () => {
      const payload = {
        type: EventType.EXPENSE,
        name: 'NoAuth Event',
        amount: 10,
        startDate: new Date().toISOString(),
        recurrenceId: '1',
        categoryId: '1',
      };
      await request(app.getHttpServer())
        .post('/events')
        .send(payload)
        .expect(401);
    });
  });

  describe('GET /events', () => {
    it('should return all events for the user', async () => {
      // Ensure there's at least one event
      const events = await eventRepo.find();
      expect(events.length).toBeGreaterThanOrEqual(1);

      const res = await request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const responseBody = res.body as EventResponse[];
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(events.length);

      responseBody.forEach((evt) => {
        expect(evt).toHaveProperty('id');
        expect(evt).toHaveProperty('name');
        expect(evt).toHaveProperty('amount');
        expect(evt).toHaveProperty('type');
        expect(evt).toHaveProperty('recurrence');
        expect(evt).toHaveProperty('category');
        expect(evt).toHaveProperty('userId');
      });
    });

    it('should return 401 for missing token', async () => {
      await request(app.getHttpServer()).get('/events').expect(401);
    });
  });

  describe('GET /events/:id', () => {
    it('should return a specific event', async () => {
      const saved = await eventRepo.findOne({ where: { id: seededEvent.id } });
      if (!saved) throw new Error('Event not found');

      const res = await request(app.getHttpServer())
        .get(`/events/${saved.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const responseBody = res.body as EventResponse;
      expect(responseBody).toMatchObject({
        id: saved.id,
        name: saved.name,
        amount: saved.amount,
        type: saved.type,
        recurrence: {
          id: savedRecurrence.id,
          frequency: savedRecurrence.frequency,
        },
        category: {
          id: savedCategory.id,
          name: savedCategory.name,
          icon: savedCategory.icon,
        },
        userId: saved.userId,
      });
    });

    it('should return 404 for non-existent event', async () => {
      await request(app.getHttpServer())
        .get('/events/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should return 401 for missing token', async () => {
      const saved = await eventRepo.findOne({ where: { id: seededEvent.id } });
      if (!saved) throw new Error('Event not found');

      await request(app.getHttpServer()).get(`/events/${saved.id}`).expect(401);
    });
  });

  describe('PATCH /events/:id', () => {
    it('should update an existing event', async () => {
      const saved = await eventRepo.findOne({ where: { id: seededEvent.id } });
      if (!saved) throw new Error('Event not found');

      const update = { name: 'Updated Event', amount: 99.99 };
      const res = await request(app.getHttpServer())
        .patch(`/events/${saved.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(update)
        .expect(200);

      const responseBody = res.body as EventResponse;
      expect(responseBody.name).toBe('Updated Event');
      expect(responseBody.amount).toBe(99.99);

      const reloaded = await eventRepo.findOne({ where: { id: saved.id } });
      if (!reloaded) throw new Error('Event not found after update');
      expect(reloaded.name).toBe('Updated Event');
      expect(Number(reloaded.amount)).toBeCloseTo(99.99);
    });

    it('should return 404 for non-existent event', async () => {
      const update = { name: 'NoEvent', amount: 1.0 };
      await request(app.getHttpServer())
        .patch('/events/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(update)
        .expect(404);
    });

    it('should return 401 if event not found', async () => {
      const saved = await eventRepo.findOne({ where: { id: seededEvent.id } });
      if (!saved) throw new Error('Event not found');

      const update = { name: 'NoAuth', amount: 5.0 };
      await request(app.getHttpServer())
        .patch(`/events/${saved.id}`)
        .send(update)
        .expect(401);
    });
  });

  describe('DELETE /events/:id', () => {
    it('should delete an existing event', async () => {
      const user = await userRepo.findOne({
        where: { email: 'test@example.com' },
      });
      if (!user) throw new Error('User not found');

      // Creer un evenement dedie a la suppression
      const toDelete = await eventRepo.save(
        eventRepo.create({
          type: EventType.INCOME,
          name: 'Delete Me',
          amount: 10.0,
          startDate: new Date(),
          endDate: '',
          recurrenceId: savedRecurrence.id,
          categoryId: savedCategory.id,
          userId: user.id,
        }),
      );

      await request(app.getHttpServer())
        .delete(`/events/${toDelete.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const found = await eventRepo.findOne({ where: { id: toDelete.id } });
      expect(found).toBeNull();
    });

    it('should return 404 for non-existent id event', async () => {
      await request(app.getHttpServer())
        .delete('/events/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should return 401 for missing token', async () => {
      const saved = await eventRepo.findOne({ where: { id: seededEvent.id } });
      if (!saved) throw new Error('Event not found');

      await request(app.getHttpServer())
        .delete(`/events/${saved.id}`)
        .expect(401);
    });
  });
});
