import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { EffectsModule, provideEffects, USER_PROVIDED_EFFECTS } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AppEffects } from './store/app.effects';
import { ConfigService, initializeApp } from './services/config.service';
import { ConfigInterceptor } from './interceptors/config.interceptor';

console.log('%c[CONFIG] 🏗️ Application config being created', 'color: brown; font-weight: bold; font-size: 14px');

export const appConfig: ApplicationConfig = {
  providers: [
    // APP_INITIALIZER - This will run FIRST, before anything else
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },
    
    // HTTP Client setup
    provideHttpClient(withInterceptorsFromDi()),    
    // NgRx Store - Initializes AFTER APP_INITIALIZER
    provideStore({ app: appReducer }),
    
    // NgRx Effects setup
    importProvidersFrom(
      EffectsModule.forRoot(),
    ),
    AppEffects,
    
    // USER_PROVIDED_EFFECTS - Provide effects using the token directly with factory
    {
      provide: USER_PROVIDED_EFFECTS,
      multi: true,
      useFactory: () => {
        console.log('%c[USER_PROVIDED_EFFECTS] 🎯 Factory function called - Providing AppEffects', 'color: red; font-weight: bold; font-size: 14px');
        console.log('[USER_PROVIDED_EFFECTS] This factory runs AFTER APP_INITIALIZER completes!');
        console.log('[USER_PROVIDED_EFFECTS] Returning effect classes:', [AppEffects]);
        return [AppEffects];
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (configService: ConfigService) => {
        console.log('%c[HTTP_INTERCEPTORS] 🎯 Factory function called - Creating ConfigInterceptor', 'color: cyan; font-weight: bold; font-size: 14px');
        console.log('[HTTP_INTERCEPTORS] Config available in factory:', configService.getConfig());
        return new ConfigInterceptor(configService);
      },
      multi: true,
      deps: [ConfigService]
    },
  ]
};

