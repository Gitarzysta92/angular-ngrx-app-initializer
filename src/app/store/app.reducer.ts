import { createReducer, on } from '@ngrx/store';
import * as AppActions from './app.actions';

export interface AppState {
  initialized: boolean;
  data: string | null;
  effectsInitialized: string[];
}

export const initialState: AppState = {
  initialized: false,
  data: null,
  effectsInitialized: []
};

export const appReducer = createReducer(
  initialState,
  on(AppActions.initApp, (state, { timestamp }) => {
    console.log('%c[REDUCER] 📦 Processing initApp action', 'color: orange; font-weight: bold');
    return {
      ...state,
      initialized: true
    };
  }),
  on(AppActions.loadDataSuccess, (state, { data }) => {
    console.log('%c[REDUCER] 📦 Processing loadDataSuccess action', 'color: orange; font-weight: bold');
    return {
      ...state,
      data
    };
  }),
  on(AppActions.effectInitialized, (state, { effectName, timestamp }) => {
    console.log(`%c[REDUCER] 📦 Processing effectInitialized action for ${effectName}`, 'color: orange; font-weight: bold');
    return {
      ...state,
      effectsInitialized: [...state.effectsInitialized, effectName]
    };
  })
);

