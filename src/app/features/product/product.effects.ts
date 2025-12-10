import { Injectable } from '@angular/core';
import { Actions, createEffect, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';

/**
 * ProductEffects - Another route-level effect
 * 
 * This is a second example of lazy-loaded effects that demonstrate
 * the same behavior: initialized after APP_INITIALIZER completes.
 */
@Injectable()
export class ProductEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private configService: ConfigService
  ) {
    console.log('%c[ROUTE EFFECTS] 🎯 ProductEffects constructor - Another lazy effect', 'color: darkorange; font-weight: bold; font-size: 14px');
    console.log('[ROUTE EFFECTS] Config in product effect:', this.configService.getConfig());
    console.log('[ROUTE EFFECTS] ✅ Multiple route effects can coexist independently!');
  }

  ngrxOnInitEffects(): Action {
    console.log('%c[ROUTE EFFECTS] 🎯 ProductEffects.ngrxOnInitEffects() called', 'color: darkorange; font-weight: bold; font-size: 14px');
    return { type: '[Product Route] Effects Initialized' };
  }

  // Example effect
  logProductActions$ = createEffect(() => 
    this.actions$.pipe(
      tap(action => {
        if (action.type.includes('Product')) {
          console.log('[ROUTE EFFECTS] Product action:', action.type);
        }
      })
    ),
    { dispatch: false }
  );
}

