import assert from 'node:assert/strict';
import test from 'node:test';
import { Email } from '../Email.js';
import { UserRegistration, type UserRepository } from './UserRegistration.js';
import { UserDirectory } from './UserDirectory.js';
import { User } from '../User.js';

test('Email is normalized and compared by value', () => {
  const a = Email.create(' Learner@Example.COM ');
  const b = Email.create('learner@example.com');
  assert.equal(a.toString(), 'learner@example.com');
  assert.equal(a.equals(b), true);
});

test('invalid runtime input has a typed Result and an exception wrapper', () => {
  assert.deepEqual(Email.tryCreate(42), { ok: false, error: 'INVALID_EMAIL_TYPE' });
  assert.deepEqual(Email.tryCreate('not-an-email'), { ok: false, error: 'INVALID_EMAIL_FORMAT' });
  assert.throws(() => Email.create('not-an-email'), /INVALID_EMAIL_FORMAT/);
});

test('entity equality uses identity while Email equality uses value', () => {
  const email = Email.create('same@example.com');
  const first = new User(1, 'First', email);
  const changed = new User(1, 'Changed', Email.create('other@example.com'));
  const another = new User(2, 'First', email);
  assert.equal(first.equals(changed), true);
  assert.equal(first.equals(another), false);
});

test('invalid user construction is rejected before state exists', () => {
  assert.throws(() => new User(0, 'Valid Name', Email.create('a@example.com')), /INVALID_USER_ID/);
  assert.throws(() => new User(1, ' ', Email.create('a@example.com')), /INVALID_USER_NAME/);
});

test('change to same canonical email is an explicit no-op', () => {
  const user = new User(1, 'Learner', Email.create('learner@example.com'));
  user.changeEmail(Email.create(' LEARNER@EXAMPLE.COM '));
  assert.equal(user.getEmail(), 'learner@example.com');
});

test('UserDirectory rejects duplicate identity and keeps O(1)-average lookup', () => {
  const directory = new UserDirectory();
  const user = new User(1, 'Learner', Email.create('learner@example.com'));
  assert.deepEqual(directory.add(user), { ok: true, value: undefined });
  assert.deepEqual(directory.add(user), { ok: false, error: 'DUPLICATE_USER_ID' });
  assert.equal(directory.findById(1), user);
});

test('registration depends on ports, not a concrete database', async () => {
  const saved: User[] = [];
  const repository: UserRepository = {
    existsByEmail: async () => false,
    save: async (user) => { saved.push(user); },
  };
  const useCase = new UserRegistration(repository, { next: () => 42 });
  const result = await useCase.execute({ name: 'An', email: 'an@example.com' });
  assert.equal(result.ok, true);
  assert.equal(saved.length, 1);
  assert.equal(saved[0]?.id, 42);
});

test('duplicate email is a typed domain outcome and does not save', async () => {
  const repository: UserRepository = {
    existsByEmail: async () => true,
    save: async () => assert.fail('must not save'),
  };
  const result = await new UserRegistration(repository, { next: () => 1 })
    .execute({ name: 'An', email: 'an@example.com' });
  assert.deepEqual(result, { ok: false, error: 'EMAIL_TAKEN' });
});
