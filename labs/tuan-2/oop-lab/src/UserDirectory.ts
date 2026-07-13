import type { User } from '../User.js';
import type { Result } from './Result.js';

export class UserDirectory {
  private readonly byId = new Map<number, User>();

  add(user: User): Result<void, 'DUPLICATE_USER_ID'> {
    if (this.byId.has(user.id)) return { ok: false, error: 'DUPLICATE_USER_ID' };
    this.byId.set(user.id, user);
    return { ok: true, value: undefined };
  }

  findById(id: number): User | undefined { return this.byId.get(id); }
  values(): User[] { return [...this.byId.values()]; }
}
