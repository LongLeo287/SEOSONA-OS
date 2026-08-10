import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const policyFile = new URL('./content-policy.v1.json', import.meta.url);

test('OS publishes a configurable Facebook batch-size policy', async () => {
  const document = JSON.parse(await readFile(policyFile, 'utf8'));

  assert.deepEqual(document.policy.batchSize, { default: 5, min: 1, max: 20 });
  assert.equal(document.policy.cadencePerWeek, 5);
  assert.equal(document.policy.facebookPublishing, 'not_supported_in_v1');
});
