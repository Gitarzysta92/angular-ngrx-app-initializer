import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { tap, switchMap, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
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
    private configService: ConfigService,
    private http: HttpClient
  ) {
    console.log('%c[ROUTE EFFECTS] 🎯 UserEffects constructor - Lazy-loaded effect instantiated', 'color: purple; font-weight: bold; font-size: 14px');
    console.log('[ROUTE EFFECTS] Config available in route effect:', this.configService.getConfig());
    console.log('[ROUTE EFFECTS] ✅ Route effects also run AFTER APP_INITIALIZER!');
  }

  ngrxOnInitEffects(): Action {
    console.log('%c[ROUTE EFFECTS] 🎯 UserEffects.ngrxOnInitEffects() called', 'color: purple; font-weight: bold; font-size: 14px');
    return { type: '[User Route] Effects Initialized' };
  }

  // Example effect - logs all actions when on user route and makes HTTP call to test interceptor
  logUserActions$ = createEffect(() => 
    this.actions$.pipe(
      filter(action => action.type.includes('Action Triggered')),
      tap(action => {
        console.log('[ROUTE EFFECTS] User route action:', action.type);
      }),
      switchMap(() => {
        console.log('%c[ROUTE EFFECTS] 🌐 Making HTTP request to test interceptor', 'color: purple; font-weight: bold; font-size: 14px');
        console.log('[ROUTE EFFECTS] This request will go through ConfigInterceptor!');
        
        // Make an HTTP request - the interceptor will intercept it
        return this.http.get('/api/users').pipe(
          tap({
            next: (response) => {
              console.log('[ROUTE EFFECTS] ✅ HTTP request completed:', response);
            },
            error: (error) => {
              console.log('[ROUTE EFFECTS] ⚠️ HTTP request failed (expected - no server):', error);
              console.log('[ROUTE EFFECTS] But the interceptor was called! Check console above for interceptor logs.');
            }
          })
        );
      })
    ),
    { dispatch: false }
  );
}

