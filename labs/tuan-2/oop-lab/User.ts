import { Email } from './Email';

export class User {
  constructor(
    public readonly id: number,
    public name: string,
    private email: Email
  ) {}

  changeEmail(newEmail: string) {
    // Todo
  }
}

