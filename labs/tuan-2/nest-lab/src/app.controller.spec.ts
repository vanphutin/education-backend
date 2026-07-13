import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CLOCK } from './clock.port';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: CLOCK, useValue: { now: () => new Date('2026-01-02T03:04:05.000Z') } }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('resolves a token-based dependency and returns deterministic output', () => {
      expect(appController.getHealth()).toEqual({ status: 'ok', checkedAt: '2026-01-02T03:04:05.000Z' });
    });
  });
});
