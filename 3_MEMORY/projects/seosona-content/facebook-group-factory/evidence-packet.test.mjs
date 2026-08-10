import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const packet = JSON.parse(readFileSync(new URL('./evidence-packet.v1.json', import.meta.url), 'utf8'));

test('OS publishes a reviewable official-source evidence packet for Facebook content', () => {
  assert.equal(packet.packetVersion, '1.0');
  assert.equal(packet.status, 'verified');
  assert.match(packet.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(packet.reverifyAfter, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Date.parse(packet.reverifyAfter) > Date.parse(packet.verifiedAt));
  assert.ok(packet.evidence.length >= 10);

  const ids = new Set();
  for (const item of packet.evidence) {
    assert.match(item.id, /^google-search-[a-z0-9-]+$/);
    assert.equal(ids.has(item.id), false, `duplicate evidence id: ${item.id}`);
    ids.add(item.id);
    assert.ok(item.claim.length >= 20, `${item.id} has an underspecified claim`);
    assert.equal(item.language, 'en');
    assert.equal(item.sourceType, 'official_documentation');
    assert.ok(item.sourceTitle.length > 0);
    const source = new URL(item.source);
    assert.equal(source.protocol, 'https:');
    assert.equal(source.hostname, 'developers.google.com');
    assert.match(item.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(item.sourceLastUpdated, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Array.isArray(item.topics) && item.topics.length > 0);
  }
});

test('evidence claims stay atomic so Content can require verbatim mapping', () => {
  for (const item of packet.evidence) {
    assert.equal(/[.!?]\s+\S/u.test(item.claim), false, `${item.id} contains multiple sentences`);
    assert.equal(item.claim.trim().endsWith('.'), true, `${item.id} must be a complete sentence`);
  }
});
