function getIdentifyProperties() {
  return [ 'userId' ];
}

function extractFields(obj: Object, keys: Array) {
  return keys.map(key => obj[key]);
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
