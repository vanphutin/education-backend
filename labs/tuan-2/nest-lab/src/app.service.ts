import { Inject, Injectable } from '@nestjs/common';
import { CLOCK, type Clock } from './clock.port';

@Injectable()
export class AppService {
  constructor(@Inject(CLOCK) private readonly clock: Clock) {}

  getHealth(): { status: 'ok'; checkedAt: string } {
    return { status: 'ok', checkedAt: this.clock.now().toISOString() };
  }
}
