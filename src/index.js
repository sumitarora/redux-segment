export function createTracker() {
  return ({ dispatch, getState }) =>  next => action => handleAction(next, action);
}

function handleAction(next: Function, action: Object) {
  switch (action.type) {
    case '@@router/INIT_PATH':
    case '@@router/UPDATE_PATH':
      window.analytics.page();
      return next(action);
    default:
      return next(action);
  }
}
