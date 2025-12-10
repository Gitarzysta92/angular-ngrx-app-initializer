# 🚀 Route-Level Effects Guide

## Overview

This guide explains how **lazy-loaded route effects** work in NgRx and how they relate to `APP_INITIALIZER`.

## What Are Route-Level Effects?

Route-level effects are NgRx effects that are provided at the route level using Angular's routing `providers` array. These effects are:

- ✅ **Lazy-loaded** - Only instantiated when the route is activated
- ✅ **Scoped to the route** - Exist only while the route is active
- ✅ **Independent** - Each route can have its own effects
- ✅ **Have access to APP_INITIALIZER config** - Because APP_INITIALIZER completes before routing starts

## Configuration Example

### Route Configuration

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './features/user/user.effects';

export const routes: Routes = [
  {
    path: 'user',
    loadComponent: () => import('./features/user/user.component').then(m => m.UserComponent),
    providers: [
      // These effects load when the route activates
      provideEffects(UserEffects)
    ]
  }
];
```

### Effect Implementation

```typescript
// user.effects.ts
import { Injectable } from '@angular/core';
import { Actions, OnInitEffects } from '@ngrx/effects';
import { ConfigService } from '../../services/config.service';

@Injectable()
export class UserEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private configService: ConfigService
  ) {
    console.log('UserEffects instantiated');
    // Config is ALWAYS available here!
    const config = this.configService.getConfig();
    console.log('Config:', config);
  }

  ngrxOnInitEffects(): Action {
    return { type: '[User Route] Effects Initialized' };
  }
}
```

## Complete Initialization Timeline

### Application Startup

```
Time: 0ms
├─ [MAIN] bootstrapApplication() called
│
Time: 1ms
├─ [APP_INITIALIZER] Factory function called
│
Time: 2ms
├─ [APP_INITIALIZER] ConfigService.load() starts
│   ⏳ Async operation (fetching config from server)
│
Time: 1002ms (after 1 second)
├─ [APP_INITIALIZER] ConfigService.load() completes ✅
│
Time: 1003ms
├─ [STORE] NgRx Store initialized
│
Time: 1004ms
├─ [USER_PROVIDED_EFFECTS] Root effects factory called
│
Time: 1005ms
├─ [EFFECT] AppEffects constructor called (root effect)
│
Time: 1006ms
├─ [EFFECT] AppEffects.ngrxOnInitEffects() called
│
Time: 1007ms
├─ [COMPONENT] AppComponent constructor
│
Time: 1008ms
└─ [BOOTSTRAP] Complete ✅
```

### User Navigates to /user Route

```
Time: 5000ms (user clicks "Load User Feature")
├─ [ROUTES] Angular router activates /user route
│
Time: 5001ms
├─ [ROUTES] UserComponent loadComponent() called
│
Time: 5002ms
├─ [ROUTE EFFECTS] provideEffects(UserEffects) processed
│
Time: 5003ms
├─ [ROUTE EFFECTS] UserEffects constructor called
│   ✅ Config is available (loaded 4 seconds ago)
│
Time: 5004ms
├─ [ROUTE EFFECTS] UserEffects.ngrxOnInitEffects() called
│
Time: 5005ms
└─ [USER COMPONENT] UserComponent instantiated
```

## Key Observations

### 1. APP_INITIALIZER Completes First

```
APP_INITIALIZER (t=1002ms) → Bootstrap (t=1008ms) → Route Navigation (t=5000ms)
```

Route effects **cannot** run before APP_INITIALIZER because:
- APP_INITIALIZER blocks bootstrap
- Routing only works after bootstrap completes
- Therefore, route effects always run after APP_INITIALIZER

### 2. Route Effects Are Truly Lazy

```typescript
// Root effects load at startup
provideEffects(AppEffects)  // Loads at t=1004ms

// Route effects load on-demand
{
  path: 'user',
  providers: [provideEffects(UserEffects)]  // Loads at t=5003ms (when user navigates)
}
```

### 3. Multiple Route Effects Are Independent

```typescript
// Each route can have different effects
{
  path: 'user',
  providers: [provideEffects(UserEffects)]
},
{
  path: 'product',
  providers: [provideEffects(ProductEffects)]  // Independent of UserEffects
}
```

Navigating from `/user` to `/product`:
- UserEffects may be destroyed (depending on route reuse strategy)
- ProductEffects are instantiated fresh
- Both have access to the same APP_INITIALIZER config

## Real-World Use Cases

### 1. Feature-Specific API Calls

```typescript
@Injectable()
export class UserEffects {
  constructor(private http: HttpClient, private config: ConfigService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() => {
        const apiUrl = this.config.getConfig().apiUrl;
        return this.http.get(`${apiUrl}/users`);
      })
    )
  );
}
```

### 2. Analytics Per Feature

```typescript
@Injectable()
export class UserAnalyticsEffects {
  constructor(private analytics: AnalyticsService) {}

  trackUserPageViews$ = createEffect(() =>
    this.actions$.pipe(
      tap(action => {
        this.analytics.track('user_feature', action.type);
      })
    ),
    { dispatch: false }
  );
}
```

### 3. Feature-Specific WebSocket Connections

```typescript
@Injectable()
export class ChatEffects implements OnDestroy {
  private wsConnection: WebSocket;

  constructor(private config: ConfigService) {
    const wsUrl = this.config.getConfig().websocketUrl;
    this.wsConnection = new WebSocket(`${wsUrl}/chat`);
  }

  ngOnDestroy() {
    this.wsConnection.close();
  }
}
```

## Comparison: Root vs Route Effects

| Aspect | Root Effects | Route Effects |
|--------|-------------|---------------|
| **When Loaded** | At app startup | When route activates |
| **Lifecycle** | Lives entire app lifetime | Lives while route is active |
| **Use Case** | Global app logic | Feature-specific logic |
| **Performance** | Loads upfront (slower initial load) | Lazy-loaded (faster initial load) |
| **Config Access** | ✅ Available | ✅ Available |
| **APP_INITIALIZER Order** | After APP_INITIALIZER | After APP_INITIALIZER |

## Best Practices

### ✅ DO: Use Route Effects For

- Feature-specific business logic
- Feature-specific API calls
- Analytics for specific features
- WebSocket connections for specific features
- Effects that should only run on certain pages

### ❌ DON'T: Use Route Effects For

- Global authentication logic (use root effects)
- Global error handling (use root effects)
- App-wide notifications (use root effects)
- Logging that needs to capture all actions (use root effects)

## Testing Route Effects

### Unit Testing

```typescript
describe('UserEffects', () => {
  let effects: UserEffects;
  let actions$: Observable<Action>;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        {
          provide: ConfigService,
          useValue: { getConfig: () => ({ apiUrl: 'http://test' }) }
        }
      ]
    });

    effects = TestBed.inject(UserEffects);
  });

  it('should have access to config', () => {
    expect(configService.getConfig()).toBeTruthy();
  });
});
```

### Integration Testing

Navigate to routes and verify effects load:

```typescript
it('should load UserEffects when navigating to /user', async () => {
  const fixture = TestBed.createComponent(AppComponent);
  const router = TestBed.inject(Router);
  
  // Navigate to user route
  await router.navigate(['/user']);
  
  // Verify effect was instantiated
  // Check console logs or spy on effect actions
});
```

## Console Output Example

When you run the demo app and navigate to routes:

```
[APP_INITIALIZER] ✅ COMPLETE - ConfigService.load() finished
[USER_PROVIDED_EFFECTS] 🎯 Factory function called - Providing AppEffects
[EFFECT] 🔨 CONSTRUCTOR - AppEffects class instantiated
[COMPONENT] 🔨 CONSTRUCTOR - AppComponent instantiated

// User clicks "Load User Feature"
[ROUTES] 👤 Loading User feature (lazy)...
[ROUTE EFFECTS] 🎯 UserEffects constructor - Lazy-loaded effect instantiated
[ROUTE EFFECTS] Config available in route effect: {apiUrl: 'https://api.example.com', ...}
[ROUTE EFFECTS] ✅ Route effects also run AFTER APP_INITIALIZER!
[USER COMPONENT] 🔨 Constructor - Lazy-loaded component instantiated

// User clicks "Load Product Feature"
[ROUTES] 📦 Loading Product feature (lazy)...
[ROUTE EFFECTS] 🎯 ProductEffects constructor - Another lazy effect
[ROUTE EFFECTS] Config in product effect: {apiUrl: 'https://api.example.com', ...}
```

## Conclusion

**Route-level effects are a powerful feature for code-splitting and lazy-loading in NgRx applications.** They:

1. ✅ Load only when needed (performance benefit)
2. ✅ Keep feature logic isolated (maintainability)
3. ✅ Always run after APP_INITIALIZER (guaranteed config access)
4. ✅ Work seamlessly with root effects (no conflicts)

The key insight: **APP_INITIALIZER blocks the entire app bootstrap, so by the time ANY route activates, APP_INITIALIZER has already completed.** This guarantees that all effects—root and route-level—have access to initialized configuration and services.

