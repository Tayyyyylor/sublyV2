/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/recurrence/recurrence.integration.spec.ts

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

import { Recurrence, Frequency } from './recurrence.entity';
import { RecurrenceModule } from './recurrence.module';

import { Event } from '../events/event.entity';
import { Category } from '../categories/category.entity';

interface LoginResponse {
  access_token: string;
}

interface RecurrenceResponse {
  id: string;
  frequency: string;
}

describe('Recurrence Integration (GET endpoints)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let recurrenceRepo: Repository<Recurrence>;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User, Recurrence, Event, Category],
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
        RecurrenceModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    recurrenceRepo = moduleFixture.get<Repository<Recurrence>>(
      getRepositoryToken(Recurrence),
    );

    const hashed = await bcrypt.hash('password123!', 10);
    await userRepo.save(
      userRepo.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashed,
      }),
    );

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123!' })
      .expect(200);
    jwtToken = (loginResponse.body as LoginResponse).access_token;

    const recs = [
      {
        frequency: Frequency.DAILY,
      },
      {
        frequency: Frequency.WEEKLY,
      },
      {
        frequency: Frequency.MONTHLY,
      },
    ];
    await recurrenceRepo.save(recs.map((r) => recurrenceRepo.create(r)));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /recurrences', () => {
    it('should return all recurrences', async () => {
      const res = await request(app.getHttpServer())
        .get('/recurrences')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(3);

      (res.body as RecurrenceResponse[]).forEach((rec) => {
        expect(rec).toHaveProperty('id');
        expect(rec).toHaveProperty('frequency');
        expect(typeof rec.id).toBe('string');
        expect(typeof rec.frequency).toBe('string');
      });
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/recurrences').expect(401);
    });
  });

  describe('GET /recurrences/:id', () => {
    it('should return a specific recurrence', async () => {
      const saved = await recurrenceRepo.findOne({ where: {} });
      if (!saved) throw new Error('Recurrence not found');

      const res = await request(app.getHttpServer())
        .get(`/recurrences/${saved.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const recResponse = res.body as RecurrenceResponse;

      expect(recResponse).toMatchObject({
        id: saved.id,
        frequency: saved.frequency,
      });
    });

    it('should return 404 for a non-existent ID', async () => {
      await request(app.getHttpServer())
        .get('/recurrences/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      const saved = await recurrenceRepo.findOne({ where: {} });
      if (!saved) throw new Error('Recurrence not found');

      await request(app.getHttpServer())
        .get(`/recurrences/${saved.id}`)
        .expect(401);
    });
  });
});
