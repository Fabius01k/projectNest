import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('throttler in registration', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: 'djfjfjfjgjg',
        password: '147852369',
        email: 'email@gmai',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: 'djfjfjfjgjg',
        password: '147852369',
        email: 'email@gmail',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: 'djfjfjfjgjg',
        password: '147852369',
        email: 'email@gmail',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: 'djfjfjfjgjg',
        password: '147852369',
        email: 'email@gmai',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: 'djfjfjfjgjg',
        password: '147852369',
        email: 'email@gmai',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: 'djfjfjfjgjg',
        password: '147852369',
        email: 'email@gmai',
      })
      .expect(429);
  });
  it('throttler in login', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: 'djfjfjfjgjgghj',
        password: '147852369',
      })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: 'djfjfjhgfjgjg',
        password: '147852369',
      })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: 'djfjfjfgfrjgjg',
        password: '147852369',
      })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: 'djfjfjftfjgjg',
        password: '147852369',
      })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: 'djfjfjtefjgjg',
        password: '147852369',
      })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: 'djfjfjrtfjgjg',
        password: '147852369',
      })
      .expect(429);
  });
});
