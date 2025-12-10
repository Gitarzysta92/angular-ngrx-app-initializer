import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';

/**
 * UserEffects - Provided via route-level provideEffects()
 * 
 * This demonstrates that even lazy-loaded effects in route providers
 * are instantiated AFTER APP_INITIALIZER completes.
 */
@Injectable()
export class UserEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private configService: ConfigService
  ) {
    console.log('%c[ROUTE EFFECTS] 🎯 UserEffects constructor - Lazy-loaded effect instantiated', 'color: purple; font-weight: bold; font-size: 14px');
    console.log('[ROUTE EFFECTS] Config available in route effect:', this.configService.getConfig());
    console.log('[ROUTE EFFECTS] ✅ Route effects also run AFTER APP_INITIALIZER!');
  }

  ngrxOnInitEffects(): Action {
    console.log('%c[ROUTE EFFECTS] 🎯 UserEffects.ngrxOnInitEffects() called', 'color: purple; font-weight: bold; font-size: 14px');
    return { type: '[User Route] Effects Initialized' };
  }

  // Example effect - logs all actions when on user route
  logUserActions$ = createEffect(() => 
    this.actions$.pipe(
      tap(action => {
        if (action.type.includes('User')) {
          console.log('[ROUTE EFFECTS] User route action:', action.type);
        }
      })
    ),
    { dispatch: false }
  );
}

