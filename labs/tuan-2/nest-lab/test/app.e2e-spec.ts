import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(new Date(body.checkedAt).toISOString()).toBe(body.checkedAt);
      });
  });

  it('/users (GET) returns transport DTOs', () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect([
      { id: 1, displayName: 'Alice' },
      { id: 2, displayName: 'Bob' },
    ]);
  });

  it('/users/:id maps typed not-found to a safe 404 contract', async () => {
    const response = await request(app.getHttpServer()).get('/users/999').expect(404);
    expect(response.body).toEqual({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    expect(JSON.stringify(response.body)).not.toContain('stack');
  });

  afterEach(async () => {
    await app.close();
  });
});
