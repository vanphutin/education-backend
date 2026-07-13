import test from 'node:test'; import assert from 'node:assert/strict'; import { percentile, releaseGate } from './week-10.js';
test('week 10 calculates percentile without mutating input',()=>{const v=[100,20,30,40,50]; assert.equal(percentile(v,95),100); assert.deepEqual(v,[100,20,30,40,50]);});
test('week 10 blocks release when performance or evidence fails',()=>assert.deepEqual(releaseGate({tests:true,errorRate:.02,p95Ms:450,maxP95Ms:300,criticalEvidence:false}),{pass:false,failures:['ERROR_RATE','P95','EVIDENCE']}));
