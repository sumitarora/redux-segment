function getAliasProperties() {
  return [ 'userId', 'previousId' ];
}

function validateAliasFields(fields: Object) {
  if (!fields.userId) return new Error('missing userId field for EventTypes.alias');

  return null;
}

function extractFields(obj: Object, keys: Array) {
  return keys.map(key => obj[key]);
}

function extractAliasFields(fields: Object) {
  const props = getAliasProperties(fields);

  const err = validateAliasFields(fields);
  if (err) throw err;

  return extractFields(fields, props);
}


export {
  extractAliasFields,
};
