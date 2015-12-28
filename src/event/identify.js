function getIdentifyProperties(fields: Object) {
  if (!fields.userId) return [ 'traits', 'options' ];

  return [ 'userId', 'traits', 'options' ];
}

function extractFields(obj: Object, keys: Array) {
  return keys.map(key => key === 'traits' ? obj[key] || {} : obj[key]);
}

function extractIdentifyFields(fields: Object) {
  // all fields are optional for identify events
  if (!fields) {
    return [];
  }

  const props = getIdentifyProperties(fields);

  return extractFields(fields, props);
}


export {
  extractIdentifyFields,
};
