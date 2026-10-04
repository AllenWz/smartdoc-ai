'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('./index');

test('returns accepted document metadata for S3 records', async () => {
  const result = await handler({ Records: [{ s3: { bucket: { name: 'docs' }, object: { key: 'folder%2Ffile+name.pdf' } } }] });
  assert.equal(result.processed, 1);
  assert.equal(result.documents[0].bucket, 'docs');
  assert.equal(result.documents[0].key, 'folder/file name.pdf');
  assert.equal(result.documents[0].status, 'accepted');
});

test('rejects S3 records missing object data', async () => {
  await assert.rejects(handler({ Records: [{}] }), /missing bucket or object key/);
});
