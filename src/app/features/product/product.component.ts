import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; background: #fff3e0; border-radius: 8px; margin: 20px;">
      <h2>📦 Product Feature (Lazy Loaded)</h2>
      <p>Another lazy-loaded route with its own effects.</p>

      <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
        <h3 style="margin-top: 0;">🎯 ProductEffects Loaded!</h3>
        <p>Check the console to see <strong>ProductEffects</strong> initialization logs.</p>
        <p style="color: green;">✅ This effect was also loaded after APP_INITIALIZER!</p>
        
        <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px;">
          <strong>API URL from config:</strong>
          <div style="margin: 10px 0; color: #ff9800; font-weight: bold;">
            {{ config?.apiUrl || 'Not available' }}
          </div>
        </div>
      </div>

      <div style="background: #e1f5fe; padding: 15px; border-radius: 4px; margin-top: 15px;">
        <h3 style="margin-top: 0;">💡 Key Insight</h3>
        <p>Each route can have its own effects, and they all:</p>
        <ul>
          <li>✅ Load lazily when the route is activated</li>
          <li>✅ Have access to APP_INITIALIZER config</li>
          <li>✅ Are completely independent of other route effects</li>
          <li>✅ Only exist while the route is active</li>
        </ul>
      </div>

      <button 
        (click)="dispatchAction()"
        style="margin-top: 15px; margin-right: 10px; padding: 12px 24px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
        🚀 Dispatch Product Action
      </button>

      <button 
        (click)="goBack()"
        style="margin-top: 15px; padding: 12px 24px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
        ← Back to Home
      </button>
    </div>
  `
})
export class ProductComponent implements OnInit {
  config: any;

  constructor(
    private configService: ConfigService,
    private store: Store,
    private router: Router
  ) {
    console.log('%c[PRODUCT COMPONENT] 🔨 Constructor - Lazy-loaded product component', 'color: darkorange; font-weight: bold');
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
    console.log('[PRODUCT COMPONENT] Config available:', this.config);
    this.store.dispatch({ type: '[Product Page] Loaded' });
  }

  dispatchAction() {
    console.log('%c[PRODUCT COMPONENT] 👆 User clicked product action', 'color: darkorange; font-weight: bold');
    this.store.dispatch({ type: '[Product Page] Action Triggered', payload: Date.now() });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

