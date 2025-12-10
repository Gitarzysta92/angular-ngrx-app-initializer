import { Routes } from '@angular/router';
import { EffectsModule, provideEffects, USER_PROVIDED_EFFECTS } from '@ngrx/effects';
import { UserEffects } from './features/user/user.effects';
import { ProductEffects } from './features/product/product.effects';
import { AppEffects } from './store/app.effects';
import { importProvidersFrom } from '@angular/core';

console.log('%c[ROUTES] 📍 Routes configuration being loaded', 'color: brown; font-weight: bold');

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => {
      console.log('%c[ROUTES] 🏠 Loading home component...', 'color: teal; font-weight: bold');
      return import('./app.component').then(m => m.AppComponent);
    }
  },
  {
    path: 'user',
    loadComponent: () => {
      console.log('%c[ROUTES] 👤 Loading User feature (lazy)...', 'color: purple; font-weight: bold');
      return import('./features/user/user.component').then(m => m.UserComponent);
    },
    providers: [
      importProvidersFrom(
        EffectsModule.forFeature(),
      ),
      UserEffects,
      {
        provide: USER_PROVIDED_EFFECTS,
        multi: true,
        useFactory: () => {
          console.log('%c [USER_PROVIDED_EFFECTS][ROUTES] 🎯 Factory function called - Providing UserEffects', 'color: red; font-weight: bold; font-size: 14px');
          return [UserEffects];
        }
      }
    ]
  },
  {
    path: 'product',
    loadComponent: () => {
      console.log('%c[ROUTES] 📦 Loading Product feature (lazy)...', 'color: darkorange; font-weight: bold');
      return import('./features/product/product.component').then(m => m.ProductComponent);
    },
    providers: [
      // Multiple effects can be provided at route level
      // Each route can have its own independent effects
      provideEffects(ProductEffects)
    ]
  }
];

