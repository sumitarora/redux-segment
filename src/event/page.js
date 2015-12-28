function validatePageFields(fields: Object) {
  if (fields.category && !fields.name) {
    return new Error('missing name field for EventTypes.page');
  }

  return null;
}

function getPageProperties(fields: Object) {
  if (fields.category) return [ 'category', 'name', 'properties', 'options' ];
  if (!fields.name) return [ 'properties', 'options' ];

  return [ 'name', 'properties', 'options' ];
}

function extractFields(obj: Object, keys: Array) {
  return keys.map(key => key === 'properties' ? obj[key] || {} : obj[key]);
}

function extractPageFields(fields: Object) {
  // all fields are optional for page events
  if (!fields) {
    return [];
  }

  const err = validatePageFields(fields);
  if (err) throw err;

  const props = getPageProperties(fields);

  return extractFields(fields, props);
}


export {
  extractPageFields,
};
