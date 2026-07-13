export class User {
  constructor(public readonly id: number, public readonly name: string) {
    if (!Number.isInteger(id) || id <= 0) throw new TypeError('INVALID_USER_ID');
    if (name.trim().length < 2) throw new TypeError('INVALID_USER_NAME');
  }
}
