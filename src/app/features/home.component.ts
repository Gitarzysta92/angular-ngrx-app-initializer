import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../services/config.service';
import { AppState } from '../store/app.reducer';

@Component({
  selector: 'home-component',
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

      <button (click)="navigateToUser()">Navigate to User</button>
      <button (click)="navigateToProduct()">Navigate to Product</button>
    </div>
  `
})
export class HomeComponent implements OnInit {
  state$: Observable<AppState>;
  configData: any;

  constructor(
    private store: Store<{ app: AppState }>,
    private configService: ConfigService,
    private router: Router,
    private http: HttpClient
  ) {
    console.log('%c[COMPONENT] 🔨 CONSTRUCTOR - AppComponent instantiated', 'color: teal; font-weight: bold; font-size: 14px');
    this.state$ = this.store.select('app');
    this.configData = this.configService.getConfig();
  }

  ngOnInit(): void {
    console.log('%c[COMPONENT] 🎬 ngOnInit - AppComponent initialized', 'color: teal; font-weight: bold; font-size: 14px');
    console.log('[COMPONENT] Config available in ngOnInit:', this.configData);
  }
  navigateToUser() {
    this.router.navigate(['/user']);
  }
  navigateToProduct() {
    this.router.navigate(['/product']);
  }
}

