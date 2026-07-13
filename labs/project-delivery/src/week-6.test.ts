import test from 'node:test'; import assert from 'node:assert/strict'; import { can, RefreshFamily } from './week-6.js';
test('week 6 denies permissions by default', () => { assert.equal(can('customer','catalog:write'),false); assert.equal(can('cinema_admin','catalog:write'),true); });
test('week 6 detects refresh token replay and revokes family', () => { const family=new RefreshFamily(); const old=family.issue(); family.rotate(old); assert.throws(()=>family.rotate(old),/REFRESH_REUSE_DETECTED/); assert.equal(family.isRevoked(),true); });
