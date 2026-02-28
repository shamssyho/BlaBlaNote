const sendTransacEmail = jest.fn().mockResolvedValue(undefined);
const createMessage = jest.fn().mockResolvedValue(undefined);

jest.mock('sib-api-v3-sdk', () => ({
  ApiClient: {
    instance: {
      authentications: {
        'api-key': {},
      },
    },
  },
  TransactionalEmailsApi: jest.fn().mockImplementation(() => ({ sendTransacEmail })),
}));

jest.mock('twilio', () => ({
  Twilio: jest.fn().mockImplementation(() => ({
    messages: {
      create: createMessage,
    },
  })),
}));

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../../../api/src/app/app.module';
import { DiscordService } from '../../../api/src/app/discord/discord.service';
import { WhisperService } from '../../../api/src/app/whisper/whisper.service';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
    },
  },
});

describe('API e2e', () => {
  let app: INestApplication;

  async function cleanDatabase() {
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
    `;

    if (tables.length > 0) {
      const names = tables.map((table) => `"public"."${table.tablename}"`).join(', ');
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${names} RESTART IDENTITY CASCADE;`);
    }
  }

  async function createTestUser() {
    const email = `user_${Date.now()}_${Math.random().toString(16).slice(2)}@example.com`;
    const response = await request(app.getHttpServer()).post('/auth/register').send({
      firstName: 'E2E',
      lastName: 'User',
      email,
      password: 'password123',
      termsAccepted: true,
      termsVersion: 'v1.0',
    });

    return { email, password: 'password123', id: response.body.id };
  }

  async function loginAndGetToken(email: string, password: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password, rememberMe: true })
      .expect(200);

    return {
      accessToken: response.body.access_token as string,
      cookie: response.headers['set-cookie'][0] as string,
    };
  }

  async function seedProject(accessToken: string, name = 'Project A') {
    const response = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name })
      .expect(201);

    return response.body;
  }

  async function seedNote(accessToken: string, text = 'My note') {
    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ text })
      .expect(201);

    return response.body;
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(DiscordService)
      .useValue({ sendWebhook: jest.fn().mockResolvedValue(undefined) })
      .overrideProvider(WhisperService)
      .useValue({
        processNoteAudio: jest.fn().mockResolvedValue(undefined),
        processNoteSummary: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })
    );
    await app.init();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('auth flow register login refresh', async () => {
    const user = await createTestUser();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password, rememberMe: true })
      .expect(200);

    expect(loginResponse.body.access_token).toBeTruthy();
    expect(loginResponse.body.refresh_token).toBeTruthy();

    const refreshResponse = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', loginResponse.headers['set-cookie'])
      .expect(200);

    expect(refreshResponse.body.access_token).toBeTruthy();
  });

  it('notes flow create list project assign and share', async () => {
    const user = await createTestUser();
    const { accessToken } = await loginAndGetToken(user.email, user.password);
    const project = await seedProject(accessToken);
    const note = await seedNote(accessToken, 'Critical note');

    const notesResponse = await request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const items = Array.isArray(notesResponse.body)
      ? notesResponse.body
      : notesResponse.body.items;

    expect(items.length).toBeGreaterThan(0);

    await request(app.getHttpServer())
      .patch(`/notes/${note.id}/project`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ projectId: project.id })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/notes/${note.id}/share`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ method: 'email', to: 'recipient@example.com', type: 'summary' })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/notes/${note.id}/share`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ method: 'whatsapp', to: '+15550001111', type: 'summary' })
      .expect(200);
  });

  it('projects crud flow', async () => {
    const user = await createTestUser();
    const { accessToken } = await loginAndGetToken(user.email, user.password);

    const created = await seedProject(accessToken, 'Inbox');

    const list = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(list.body.length).toBe(1);

    await request(app.getHttpServer())
      .patch(`/projects/${created.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Inbox Updated' })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/projects/${created.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
