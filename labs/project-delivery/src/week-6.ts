import { createHash, randomUUID } from 'node:crypto';
export type Role = 'customer' | 'cinema_admin' | 'system_admin';
const permissions: Record<Role, string[]> = { customer:['booking:create'], cinema_admin:['catalog:write','showtime:publish'], system_admin:['catalog:write','showtime:publish','user:disable'] };
export const can = (role: Role, permission: string) => permissions[role].includes(permission);
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export class RefreshFamily {
  private current = digest(randomUUID()); private revoked = false;
  issue(): string { return this.current; }
  rotate(presented: string): string {
    if (this.revoked || presented !== this.current) { this.revoked = true; throw new Error('REFRESH_REUSE_DETECTED'); }
    this.current = digest(randomUUID()); return this.current;
  }
  isRevoked() { return this.revoked; }
}
