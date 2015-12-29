function validateAliasFields(fields: Object) {
  if (!fields.userId) return new Error('missing userId field for EventTypes.alias');

  return null;
}

function extractAliasFields(fields: Object) {
  const err = validateAliasFields(fields);
  if (err) throw err;
}


export {
  extractAliasFields,
};
