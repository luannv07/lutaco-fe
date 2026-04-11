// core/auth/auth.service.ts
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthData, LoginRequest } from '../../models/auth';
import { BaseResponse } from '../../models/base-response';
import { BaseService } from '../../shared/services/base.service';
import { Observable, tap } from 'rxjs';

const TOKEN_STORAGE_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  protected readonly apiUrl: string = 'auth';

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      // Use global atob for browser environment
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now(); // Check expiry
    } catch {
      return false;
    }
  }

  login(loginRequest: LoginRequest): Observable<BaseResponse<AuthData>> {
    if (!isPlatformBrowser(this.platformId)) throw new Error('Unsupported platform');

    return this.http
      .post<BaseResponse<AuthData>>(`${this.baseUrl}/${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.data?.accessToken && response.data?.refreshToken) {
            localStorage.setItem(TOKEN_STORAGE_KEY, response.data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
          }
        })
      );
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }
}
