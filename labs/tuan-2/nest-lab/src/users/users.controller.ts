import { Controller, Get, NotFoundException, Param, ParseIntPipe, ServiceUnavailableException } from '@nestjs/common';
import { UsersService, type UsersResult } from './users.service';
import type { User } from './user';

interface UserResponse { id: number; displayName: string }
const toResponse = (user: User): UserResponse => ({ id: user.id, displayName: user.name });

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async list(): Promise<UserResponse[]> {
    return this.unwrap(await this.service.list()).map(toResponse);
  }

  @Get(':id')
  async find(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    return toResponse(this.unwrap(await this.service.find(id)));
  }

  private unwrap<T>(result: UsersResult<T>): T {
    if (result.ok) return result.value;
    if (result.error === 'USER_NOT_FOUND') {
      throw new NotFoundException({ error: { code: result.error, message: 'User not found' } });
    }
    throw new ServiceUnavailableException({ error: { code: result.error, message: 'User store unavailable' } });
  }
}
