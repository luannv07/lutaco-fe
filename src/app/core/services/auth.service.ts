// core/auth/auth.service.ts
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseResponse } from '../../models/base-response';

const TOKEN_STORAGE_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now(); // Check expiry
    } catch {
      return false;
    }
  }

  login(response: AuthData): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }
}
