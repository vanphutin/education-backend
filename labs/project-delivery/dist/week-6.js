import { createHash, randomUUID } from 'node:crypto';
const permissions = { customer: ['booking:create'], cinema_admin: ['catalog:write', 'showtime:publish'], system_admin: ['catalog:write', 'showtime:publish', 'user:disable'] };
export const can = (role, permission) => permissions[role].includes(permission);
const digest = (value) => createHash('sha256').update(value).digest('hex');
export class RefreshFamily {
    current = digest(randomUUID());
    revoked = false;
    issue() { return this.current; }
    rotate(presented) {
        if (this.revoked || presented !== this.current) {
            this.revoked = true;
            throw new Error('REFRESH_REUSE_DETECTED');
        }
        this.current = digest(randomUUID());
        return this.current;
    }
    isRevoked() { return this.revoked; }
}
