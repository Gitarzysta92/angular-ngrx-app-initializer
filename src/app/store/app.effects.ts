import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, tap, delay } from 'rxjs/operators';
import * as AppActions from './app.actions';
import { ConfigService } from '../services/config.service';

/**
 * AppEffects - Provided via USER_PROVIDED_EFFECTS token
 * 
 * This effect class is registered using the USER_PROVIDED_EFFECTS token
 * in app.config.ts. The key question this demo answers is:
 * 
 * ❓ When does USER_PROVIDED_EFFECTS initialize relative to APP_INITIALIZER?
 * ✅ Answer: USER_PROVIDED_EFFECTS runs AFTER APP_INITIALIZER completes!
 * 
 * This ensures that any configuration loaded in APP_INITIALIZER is available
 * when effects are instantiated and begin running.
 */
@Injectable()
export class AppEffects implements OnInitEffects {
  private constructorTime: number;

  constructor(
    private actions$: Actions,
    private configService: ConfigService
  ) {
    this.constructorTime = Date.now();
    console.log('%c[USER_PROVIDED_EFFECTS] 🎯 Processing - AppEffects being instantiated', 'color: red; font-weight: bold; font-size: 14px');
    console.log('[EFFECT] 🔨 CONSTRUCTOR - AppEffects class instantiated', 'color: red; font-weight: bold; font-size: 14px');
    console.log('[EFFECT] Config available in constructor:', this.configService.getConfig());
  }

  // This lifecycle hook runs when the effect is initialized
  ngrxOnInitEffects(): Action {
    const timestamp = new Date().toISOString();
    console.log('%c[EFFECT] 🎯 ngrxOnInitEffects() - Effect lifecycle hook called', 'color: red; font-weight: bold; font-size: 14px');
    console.log('[EFFECT] Config available in ngrxOnInitEffects:', this.configService.getConfig());
    
    return AppActions.effectInitialized({ 
      effectName: 'AppEffects',
      timestamp 
    });
  }

  // Effect that listens to loadData action
  loadData$ = createEffect(() => {
    console.log('%c[EFFECT] 📡 loadData$ effect registered', 'color: red; font-weight: bold');
    
    return this.actions$.pipe(
      ofType(AppActions.loadData),
      tap(() => console.log('%c[EFFECT] 🎬 loadData$ effect triggered', 'color: red; font-weight: bold')),
      delay(500),
      map(() => {
        const config = this.configService.getConfig();
        console.log('[EFFECT] Using config in effect:', config);
        return AppActions.loadDataSuccess({ 
          data: `Data loaded from ${config?.apiUrl || 'unknown'}` 
        });
      })
    );
  });

  // Effect that listens to init action
  initEffect$ = createEffect(() => {
    console.log('%c[EFFECT] 📡 initEffect$ effect registered', 'color: red; font-weight: bold');
    
    return this.actions$.pipe(
      ofType(AppActions.initApp),
      tap(({ timestamp }) => {
        console.log('%c[EFFECT] 🎬 initEffect$ triggered by initApp action', 'color: red; font-weight: bold');
        console.log(`[EFFECT] App initialized at: ${timestamp}`);
      })
    );
  }, { dispatch: false });
}

