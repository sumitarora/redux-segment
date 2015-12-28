function extractIdentifyFields(fields: Object) {
  // all fields are optional for identify events
  if (!fields) {
    return [];
  }
}


export {
  extractIdentifyFields,
};
