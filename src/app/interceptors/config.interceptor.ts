import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../services/config.service';

/**
 * ConfigInterceptor - HTTP Interceptor provided via HTTP_INTERCEPTORS
 * 
 * This demonstrates that HTTP interceptors can use services initialized
 * by APP_INITIALIZER. The interceptor is provided using a factory function
 * with dependencies, similar to the USER_PROVIDED_EFFECTS pattern.
 */
@Injectable()
export class ConfigInterceptor implements HttpInterceptor {
  private initTime: number;

  constructor(private configService: ConfigService) {
    this.initTime = Date.now();
    console.log('%c[INTERCEPTOR] 🔨 CONSTRUCTOR - ConfigInterceptor instantiated', 'color: cyan; font-weight: bold; font-size: 14px');
    console.log('[INTERCEPTOR] Config available in constructor:', this.configService.getConfig());
    console.log('[INTERCEPTOR] ✅ This proves HTTP_INTERCEPTORS run AFTER APP_INITIALIZER!');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const config = this.configService.getConfig();
    
    console.log('%c[INTERCEPTOR] 🎯 Intercepting HTTP request', 'color: cyan; font-weight: bold');
    console.log('[INTERCEPTOR] Request URL:', req.url);
    console.log('[INTERCEPTOR] Using config:', config);
    
    // Add API URL from config to relative URLs
    let modifiedReq = req;
    if (config?.apiUrl && !req.url.startsWith('http')) {
      const apiUrl = config.apiUrl;
      modifiedReq = req.clone({
        url: `${apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
      });
      console.log('[INTERCEPTOR] Modified URL:', modifiedReq.url);
    }

    return next.handle(modifiedReq).pipe(
      tap({
        next: (event) => {
          console.log('[INTERCEPTOR] ✅ Response received');
        },
        error: (error) => {
          console.log('[INTERCEPTOR] ❌ Request failed:', error);
        }
      })
    );
  }
}

