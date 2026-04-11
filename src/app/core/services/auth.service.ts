// core/auth/auth.service.ts
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthData, LoginRequest, UserCreateRequest } from '../../models/auth';
import { BaseResponse } from '../../models/base-response';
import { BaseService } from '../../shared/services/base.service';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

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

  getRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
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
    if (!isPlatformBrowser(this.platformId)) return throwError(() => new Error('Unsupported platform'));

    return this.http
      .post<BaseResponse<AuthData>>(`${this.baseUrl}/${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.data?.accessToken && response.data?.refreshToken) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem(TOKEN_STORAGE_KEY, response.data.accessToken);
              localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
            }
          }
        })
      );
  }

  refreshToken(): Observable<BaseResponse<AuthData>> {
    if (!isPlatformBrowser(this.platformId)) return throwError(() => new Error('Unsupported platform'));

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<BaseResponse<AuthData>>(`${this.baseUrl}/${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        if (response.data?.accessToken && response.data?.refreshToken) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(TOKEN_STORAGE_KEY, response.data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
          }
        } else {
          this.clearTokens();
          this.router.navigate(['/auth/login']);
          throw new Error('Failed to refresh token: Invalid response');
        }
      }),
      catchError(error => {
        this.clearTokens();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  clearTokens(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  logout(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      this.clearTokens(); // Clear tokens even if not in browser
      return of(null); // Return a completed observable for non-browser platforms
    }
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearTokens();
      }),
      catchError(error => {
        this.clearTokens(); // Clear tokens even if logout API fails
        return throwError(() => error);
      })
    );
  }
  register(request: UserCreateRequest): Observable<BaseResponse<void>> {
    if (!isPlatformBrowser(this.platformId)) return throwError(() => new Error('Unsupported platform'));

    return this.http.post<BaseResponse<void>>(`${this.baseUrl}/${this.apiUrl}/register`, request);
  }
}
