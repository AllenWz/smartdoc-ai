'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('./index');

test('extracts document IDs from DynamoDB stream records', async () => {
  const result = await handler({ Records: [
    { dynamodb: { Keys: { documentId: { S: 'doc-1' } } } },
    { dynamodb: { Keys: { documentId: { S: 'doc-2' } } } },
    { dynamodb: { Keys: {} } },
  ] });
  assert.equal(result.processed, 3);
  assert.deepEqual(result.documentIds, ['doc-1', 'doc-2']);
});
