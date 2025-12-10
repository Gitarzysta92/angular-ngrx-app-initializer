import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { EffectsModule, provideEffects, USER_PROVIDED_EFFECTS } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AppEffects } from './store/app.effects';
import { ConfigService, initializeApp } from './services/config.service';

console.log('%c[CONFIG] 🏗️ Application config being created', 'color: brown; font-weight: bold; font-size: 14px');

export const appConfig: ApplicationConfig = {
  providers: [

    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },
    provideStore({ app: appReducer }),
    importProvidersFrom(
      EffectsModule.forRoot(),
    ),
    AppEffects,
    {
      provide: USER_PROVIDED_EFFECTS,
      multi: true,
      useFactory: () => {
        console.log('%c[USER_PROVIDED_EFFECTS] 🎯 Factory function called - Providing AppEffects', 'color: red; font-weight: bold; font-size: 14px');
        return [AppEffects];
      }
    }
  ]
};

