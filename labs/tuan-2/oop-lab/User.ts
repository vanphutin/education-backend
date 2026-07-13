import { Email } from './Email.js';

export class User {
  constructor(
    public readonly id: number,
    public name: string,
    private email: Email,
  ) {
    if (!Number.isInteger(id) || id <= 0) throw new TypeError('INVALID_USER_ID');
    this.name = name.trim();
    if (this.name.length < 2) throw new TypeError('INVALID_USER_NAME');
  }

  changeEmail(newEmail: Email): void {
    if (this.email.equals(newEmail)) return;
    this.email = newEmail;
  }

  getEmail(): string {
    return this.email.toString();
  }

  equals(other: User): boolean {
    return this.id === other.id;
  }
}

