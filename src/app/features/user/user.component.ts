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

