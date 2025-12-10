import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';

console.log('%c╔════════════════════════════════════════════════════════════════╗', 'color: magenta; font-weight: bold');
console.log('%c║  🚀 APPLICATION BOOTSTRAP STARTING                             ║', 'color: magenta; font-weight: bold');
console.log('%c╚════════════════════════════════════════════════════════════════╝', 'color: magenta; font-weight: bold');
console.log('%c[MAIN] 📍 main.ts - Calling bootstrapApplication()', 'color: magenta; font-weight: bold; font-size: 14px');

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideRouter(routes)
  ]
})
  .then(() => {
    console.log('%c╔════════════════════════════════════════════════════════════════╗', 'color: green; font-weight: bold');
    console.log('%c║  ✅ APPLICATION BOOTSTRAP COMPLETE                             ║', 'color: green; font-weight: bold');
    console.log('%c╚════════════════════════════════════════════════════════════════╝', 'color: green; font-weight: bold');
  })
  .catch((err) => {
    console.error('❌ Application bootstrap failed:', err);
  });

