import { Injectable } from '@nestjs/common';
import { User } from './user';
import type { UsersRepository } from './users.repository';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  private readonly users = [new User(1, 'Alice'), new User(2, 'Bob')];
  async findAll(): Promise<User[]> { return [...this.users]; }
  async findById(id: number): Promise<User | null> { return this.users.find((user) => user.id === id) ?? null; }
}
