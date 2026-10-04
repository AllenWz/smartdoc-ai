'use strict';

exports.handler = async (event) => {
  const records = event?.Records ?? [];
  // TODO: invalidate or refresh Redis entries for changed document IDs.
  return {
    processed: records.length,
    documentIds: records
      .map((record) => record.dynamodb?.Keys?.documentId?.S)
      .filter(Boolean),
  };
};
