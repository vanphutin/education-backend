import { Module } from '@nestjs/common';
import { InMemoryUsersRepository } from './in-memory-users.repository';
import { UsersController } from './users.controller';
import { USERS_REPOSITORY } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, InMemoryUsersRepository, { provide: USERS_REPOSITORY, useExisting: InMemoryUsersRepository }],
  exports: [UsersService, USERS_REPOSITORY],
})
export class UsersModule {}
