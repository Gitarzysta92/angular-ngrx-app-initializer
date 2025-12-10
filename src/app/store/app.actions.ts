import { createAction, props } from '@ngrx/store';

export const initApp = createAction(
  '[App] Init',
  props<{ timestamp: string }>()
);

export const loadData = createAction('[App] Load Data');

export const loadDataSuccess = createAction(
  '[App] Load Data Success',
  props<{ data: string }>()
);

export const effectInitialized = createAction(
  '[Effect] Initialized',
  props<{ effectName: string; timestamp: string }>()
);

