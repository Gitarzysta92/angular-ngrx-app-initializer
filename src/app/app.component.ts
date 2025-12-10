import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './store/app.reducer';
import * as AppActions from './store/app.actions';
import { ConfigService } from './services/config.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
      <h1 style="color: #333;">🔬 APP_INITIALIZER vs USER_PROVIDED_EFFECTS Demo</h1>
      
      <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">📊 Check Browser Console</h2>
        <p style="margin: 10px 0;">
          Open your browser's developer console (F12) to see the <strong>initialization order</strong>.
        </p>
        <p style="background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 10px 0;">
          <strong>Expected Order:</strong><br>
          1️⃣ APP_INITIALIZER factory function<br>
          2️⃣ APP_INITIALIZER start/complete<br>
          3️⃣ StoreModule initialization<br>
          4️⃣ Effect constructor<br>
          5️⃣ Effect ngrxOnInitEffects()<br>
          6️⃣ Component constructor/ngOnInit
        </p>
      </div>

      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3>📋 Application State</h3>
        <div style="background: white; padding: 10px; border-radius: 4px; margin: 10px 0;">
          <strong>Initialized:</strong> {{ (state$ | async)?.initialized ? '✅ Yes' : '❌ No' }}
        </div>
        <div style="background: white; padding: 10px; border-radius: 4px; margin: 10px 0;">
          <strong>Data:</strong> {{ (state$ | async)?.data || 'Not loaded yet' }}
        </div>
        <div style="background: white; padding: 10px; border-radius: 4px; margin: 10px 0;">
          <strong>Effects Initialized:</strong> 
          <ul style="margin: 5px 0;">
            <li *ngFor="let effect of (state$ | async)?.effectsInitialized">{{ effect }}</li>
          </ul>
        </div>
      </div>

      <div style="background: #fff; padding: 15px; border-radius: 8px; border: 2px solid #ddd; margin: 20px 0;">
        <h3>🔧 Config from APP_INITIALIZER</h3>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">{{ configData | json }}</pre>
      </div>

      <div style="margin: 20px 0;">
        <button 
          (click)="triggerLoadData()"
          style="background: #4CAF50; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-right: 10px;">
          🚀 Trigger Load Data Effect
        </button>
        
        <button 
          (click)="triggerInit()"
          style="background: #2196F3; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
          🎯 Trigger Init Action
        </button>
      </div>

      <div style="margin: 20px 0; padding: 15px; background: #f3e5f5; border-radius: 8px;">
        <h3 style="margin-top: 0;">🧪 Test Lazy-Loaded Route Effects</h3>
        <p>Click these links to load features with their own effects:</p>
        <p style="font-size: 14px; color: #666; margin: 10px 0;">
          Watch the console when you navigate - route effects load on demand!
        </p>
        <div style="margin: 15px 0;">
          <a routerLink="/user" 
             style="display: inline-block; margin-right: 10px; margin-bottom: 10px; padding: 12px 24px; background: #9c27b0; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            👤 Load User Feature
          </a>
          <a routerLink="/product"
             style="display: inline-block; margin-bottom: 10px; padding: 12px 24px; background: #ff9800; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            📦 Load Product Feature
          </a>
        </div>
        <div style="background: #fff; padding: 10px; border-radius: 4px; font-size: 14px;">
          <strong>💡 What will happen:</strong>
          <ul style="margin: 5px 0; padding-left: 20px;">
            <li>Route effects load lazily when you click</li>
            <li>They also have access to APP_INITIALIZER config</li>
            <li>Each route has independent effects</li>
          </ul>
        </div>
      </div>

      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
        <h3 style="margin-top: 0;">✅ Conclusion</h3>
        <p style="font-size: 16px; line-height: 1.6;">
          <strong>USER_PROVIDED_EFFECTS runs AFTER APP_INITIALIZER completes.</strong><br>
          This ensures that any configuration or initialization logic in APP_INITIALIZER
          is fully complete before NgRx effects start running.
        </p>
      </div>
      
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  state$: Observable<AppState>;
  configData: any;

  constructor(
    private store: Store<{ app: AppState }>,
    private configService: ConfigService,
    private router: Router
  ) {
    console.log('%c[COMPONENT] 🔨 CONSTRUCTOR - AppComponent instantiated', 'color: teal; font-weight: bold; font-size: 14px');
    this.state$ = this.store.select('app');
    this.configData = this.configService.getConfig();
  }

  ngOnInit(): void {
    console.log('%c[COMPONENT] 🎬 ngOnInit - AppComponent initialized', 'color: teal; font-weight: bold; font-size: 14px');
    console.log('[COMPONENT] Config available in ngOnInit:', this.configData);
  }

  triggerLoadData(): void {
    console.log('%c[COMPONENT] 👆 User clicked "Load Data" button', 'color: teal; font-weight: bold');
    this.store.dispatch(AppActions.loadData());
  }

  triggerInit(): void {
    console.log('%c[COMPONENT] 👆 User clicked "Init" button', 'color: teal; font-weight: bold');
    this.store.dispatch(AppActions.initApp({ timestamp: new Date().toISOString() }));
  }
}

