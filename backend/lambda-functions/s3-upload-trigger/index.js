'use strict';

const { randomUUID } = require('node:crypto');

exports.handler = async (event) => {
  const records = event?.Records ?? [];
  const results = records.map((record) => {
    const bucket = record.s3?.bucket?.name;
    const key = decodeURIComponent((record.s3?.object?.key ?? '').replace(/\+/g, ' '));
    if (!bucket || !key) {
      throw new Error('S3 event record is missing bucket or object key');
    }

    // TODO: persist document metadata to DynamoDB and enqueue processing in SQS.
    return { documentId: randomUUID(), bucket, key, status: 'accepted' };
  });

  return { processed: results.length, documents: results };
};
