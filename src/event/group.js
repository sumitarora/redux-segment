function validateGroupFields(fields: Object) {
  if (!fields.groupId) return new Error('missing groupId field for EventTypes.alias');

  return null;
}

function extractGroupFields(fields: Object) {
  const err = validateGroupFields(fields);
  if (err) throw err;
}


export {
  extractGroupFields,
};
