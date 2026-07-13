import { UsersService } from './users.service';
import type { UsersRepository } from './users.repository';
import { User } from './user';

describe('UsersService', () => {
  it('returns typed not-found without importing HTTP concerns', async () => {
    const repository: UsersRepository = { findAll: async () => [], findById: async () => null };
    await expect(new UsersService(repository).find(99)).resolves.toEqual({ ok: false, error: 'USER_NOT_FOUND' });
  });

  it('keeps repository failure distinct from domain not-found', async () => {
    const repository: UsersRepository = {
      findAll: async () => { throw new Error('driver secret'); },
      findById: async () => { throw new Error('driver secret'); },
    };
    await expect(new UsersService(repository).list()).resolves.toEqual({ ok: false, error: 'REPOSITORY_UNAVAILABLE' });
  });

  it('can replace the adapter without changing application code', async () => {
    const repository: UsersRepository = {
      findAll: async () => [new User(7, 'Fake User')],
      findById: async () => new User(7, 'Fake User'),
    };
    const result = await new UsersService(repository).find(7);
    expect(result.ok && result.value.name).toBe('Fake User');
  });
});
