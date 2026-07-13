import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY, type UsersRepository } from './users.repository';
import type { User } from './user';

export type UsersResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: 'USER_NOT_FOUND' | 'REPOSITORY_UNAVAILABLE' };

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPOSITORY) private readonly users: UsersRepository) {}

  async list(): Promise<UsersResult<User[]>> {
    try { return { ok: true, value: await this.users.findAll() }; }
    catch { return { ok: false, error: 'REPOSITORY_UNAVAILABLE' }; }
  }

  async find(id: number): Promise<UsersResult<User>> {
    try {
      const user = await this.users.findById(id);
      return user ? { ok: true, value: user } : { ok: false, error: 'USER_NOT_FOUND' };
    } catch {
      return { ok: false, error: 'REPOSITORY_UNAVAILABLE' };
    }
  }
}
