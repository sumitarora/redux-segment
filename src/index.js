export function createTracker() {
  return ({ dispatch, getState }) =>  next => action => handleAction(next, action);
}

function handleAction(next: Function, action: Object) {
  switch (action.type) {
    case '@@router/INIT_PATH':
    case '@@router/UPDATE_PATH':
    case '@@reduxReactRouter/initRoutes':
    case '@@reduxReactRouter/routerDidChange':
    case '@@reduxReactRouter/replaceRoutes':
      window.analytics.page();
      return next(action);
    default:
      return next(action);
  }
}
