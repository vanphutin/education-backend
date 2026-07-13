import { Email } from '../Email.js';
import { User } from '../User.js';
import type { Result } from './Result.js';

export interface UserRepository {
  existsByEmail(email: Email): Promise<boolean>;
  save(user: User): Promise<void>;
}

export interface IdGenerator {
  next(): number;
}

export class UserRegistration {
  constructor(private readonly users: UserRepository, private readonly ids: IdGenerator) {}

  async execute(input: { name: string; email: string }): Promise<Result<User, 'INVALID_NAME' | 'INVALID_EMAIL' | 'EMAIL_TAKEN'>> {
    if (input.name.trim().length < 2) return { ok: false, error: 'INVALID_NAME' };

    let email: Email;
    try {
      email = Email.create(input.email);
    } catch {
      return { ok: false, error: 'INVALID_EMAIL' };
    }

    if (await this.users.existsByEmail(email)) return { ok: false, error: 'EMAIL_TAKEN' };
    const user = new User(this.ids.next(), input.name.trim(), email);
    await this.users.save(user);
    return { ok: true, value: user };
  }
}
