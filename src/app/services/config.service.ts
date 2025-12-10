import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = null;
  private loadStartTime: number = 0;
  private loadEndTime: number = 0;

  async load(): Promise<void> {
    this.loadStartTime = Date.now();
    console.log('%c[APP_INITIALIZER] 🚀 START - ConfigService.load() starting...', 'color: blue; font-weight: bold; font-size: 14px');
    
    // Simulate async operation (e.g., fetching config from server)
    await this.delay(1000);
    
    this.config = {
      apiUrl: 'https://api.example.com',
      environment: 'development',
      loadedAt: new Date().toISOString()
    };
    
    this.loadEndTime = Date.now();
    console.log('%c[APP_INITIALIZER] ✅ COMPLETE - ConfigService.load() finished', 'color: green; font-weight: bold; font-size: 14px');
    console.log(`[APP_INITIALIZER] Duration: ${this.loadEndTime - this.loadStartTime}ms`);
    console.log('[APP_INITIALIZER] Config loaded:', this.config);
  }

  getConfig(): any {
    return this.config;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Factory function for APP_INITIALIZER
export function initializeApp(configService: ConfigService) {
  return (): Promise<void> => {
    console.log('%c[APP_INITIALIZER] 🎬 FACTORY FUNCTION CALLED', 'color: purple; font-weight: bold; font-size: 14px');
    return configService.load();
  };
}

