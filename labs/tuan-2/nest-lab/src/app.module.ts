import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CLOCK, type Clock } from './clock.port';
import { UsersModule } from './users/users.module';

const systemClock: Clock = { now: () => new Date() };

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService, { provide: CLOCK, useValue: systemClock }],
})
export class AppModule {}
