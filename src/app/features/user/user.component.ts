import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; background: #e3f2fd; border-radius: 8px; margin: 20px;">
      <h2>👤 User Feature (Lazy Loaded)</h2>
      <p>This component was lazy-loaded along with its effects.</p>
      
      <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
        <h3 style="margin-top: 0;">📊 Check the Console!</h3>
        <p>The <strong>UserEffects</strong> were loaded when you navigated to this route.</p>
        <p style="color: green; font-weight: bold;">✅ Route effects also have access to APP_INITIALIZER config!</p>
        
        <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px;">
          <strong>Config loaded by APP_INITIALIZER:</strong>
          <pre style="margin: 10px 0; overflow: auto;">{{ config | json }}</pre>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin-top: 15px; border-left: 4px solid #ffc107;">
        <h3 style="margin-top: 0;">🔍 What Happened?</h3>
        <ol style="line-height: 1.8;">
          <li>APP_INITIALIZER ran and loaded config (1 second delay)</li>
          <li>Root effects (AppEffects) were initialized</li>
          <li>You clicked "Load User Feature"</li>
          <li><strong>UserEffects</strong> were instantiated on-demand for this route</li>
          <li>Config was already available from APP_INITIALIZER!</li>
        </ol>
      </div>

      <button 
        (click)="dispatchAction()"
        style="margin-top: 15px; margin-right: 10px; padding: 12px 24px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
        🚀 Dispatch User Action
      </button>

      <button 
        (click)="goBack()"
        style="margin-top: 15px; padding: 12px 24px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
        ← Back to Home
      </button>
    </div>
  `
})
export class UserComponent implements OnInit {
  config: any;

  constructor(
    private configService: ConfigService,
    private store: Store,
    private router: Router
  ) {
    console.log('%c[USER COMPONENT] 🔨 Constructor - Lazy-loaded component instantiated', 'color: purple; font-weight: bold');
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
    console.log('[USER COMPONENT] Config available in lazy component:', this.config);
    
    // Dispatch an action to trigger the route effect
    this.store.dispatch({ type: '[User Page] Loaded' });
  }

  dispatchAction() {
    console.log('%c[USER COMPONENT] 👆 User clicked action button', 'color: purple; font-weight: bold');
    this.store.dispatch({ type: '[User Page] Action Triggered', payload: Date.now() });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

