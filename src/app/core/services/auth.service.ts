// core/auth/auth.service.ts
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData, LoginRequest, SendOtpRequest, UserCreateRequest } from '../../models/auth';
import { BaseResponse } from '../../models/base-response';
import { BaseService } from '../../shared/services/base.service';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { LOCAL_STORAGE_KEY } from './local-storage.service';
import { User } from '../../models/user';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  private router = inject(Router);
  private userService = inject(UserService);
  protected readonly apiUrl: string = 'auth';

  private syncCurrentUser(force = false): Observable<void> {
    if (!this.isBrowser()) {
      return of(void 0);
    }

    if (!this.isAuthenticated()) {
      return of(void 0);
    }

    const currentUser = this.localStorageService.get<User>(LOCAL_STORAGE_KEY.USER_INFO_KEY);
    if (currentUser && !force) {
      return of(void 0);
    }

    return this.userService.getMySelf().pipe(
      map(() => void 0),
      catchError(() => of(void 0)),
    );
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return this.localStorageService.get<string>(LOCAL_STORAGE_KEY.TOKEN_STORAGE_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return this.localStorageService.get<string>(LOCAL_STORAGE_KEY.REFRESH_TOKEN_KEY);
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

  getCurrentUserStatus(): string | null {
    const user = this.localStorageService.get<User>(LOCAL_STORAGE_KEY.USER_INFO_KEY) || null;
    return user?.userStatus?.value ?? null;
  }

  getCurrentUser(): User | null {
    return this.localStorageService.get<User>(LOCAL_STORAGE_KEY.USER_INFO_KEY) || null;
  }

  private buildRegistrationOtpRequest(): SendOtpRequest | null {
    const user = this.localStorageService.get<User>(LOCAL_STORAGE_KEY.USER_INFO_KEY);
    if (!user?.email || !user?.username) {
      return null;
    }

    return {
      email: user.email,
      otpType: 'REGISTER',
      username: user.username,
    };
  }

  login(loginRequest: LoginRequest): Observable<BaseResponse<AuthData>> {
    if (!this.isBrowser())
      return throwError(() => new Error('Unsupported platform'));

    return this.http
      .post<BaseResponse<AuthData>>(`${this.baseUrl}/${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap((response) => {
          if (response.data?.accessToken && response.data?.refreshToken) {
            this.localStorageService.set(
              LOCAL_STORAGE_KEY.TOKEN_STORAGE_KEY,
              response.data.accessToken,
            );
            this.localStorageService.set(
              LOCAL_STORAGE_KEY.REFRESH_TOKEN_KEY,
              response.data.refreshToken,
            );
          }
        }),
        switchMap((response) => this.syncCurrentUser(true).pipe(map(() => response))),
      );
  }

  refreshToken(): Observable<BaseResponse<AuthData>> {
    if (!this.isBrowser())
      return throwError(() => new Error('Unsupported platform'));

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<
        BaseResponse<AuthData>
      >(`${this.baseUrl}/${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap((response) => {
          if (response.data?.accessToken && response.data?.refreshToken) {
            this.localStorageService.set(
              LOCAL_STORAGE_KEY.TOKEN_STORAGE_KEY,
              response.data.accessToken,
            );
            this.localStorageService.set(
              LOCAL_STORAGE_KEY.REFRESH_TOKEN_KEY,
              response.data.refreshToken,
            );
          } else {
            this.clearTokens();
            this.router.navigate(['/auth/login']);
            throw new Error('Failed to refresh token: Invalid response');
          }
        }),
        switchMap((response) => this.syncCurrentUser().pipe(map(() => response))),
        catchError((error) => {
          this.clearTokens();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        }),
      );
  }

  clearTokens(): void {
    if (!this.isBrowser()) return;
    this.localStorageService.remove(LOCAL_STORAGE_KEY.TOKEN_STORAGE_KEY);
    this.localStorageService.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN_KEY);
    this.localStorageService.remove(LOCAL_STORAGE_KEY.USER_INFO_KEY);
  }

  logout(): Observable<any> {
    if (!this.isBrowser()) {
      this.clearTokens(); // Clear tokens even if not in browser
      return of(null); // Return a completed observable for non-browser platforms
    }
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearTokens();
      }),
      catchError((error) => {
        this.clearTokens(); // Clear tokens even if logout API fails
        return throwError(() => error);
      }),
    );
  }
  register(request: UserCreateRequest): Observable<BaseResponse<AuthData>> {
    if (!this.isBrowser())
      return throwError(() => new Error('Unsupported platform'));

    return this.http
      .post<BaseResponse<AuthData>>(`${this.baseUrl}/${this.apiUrl}/register`, request)
      .pipe(
        switchMap((response) => this.syncCurrentUser(true).pipe(map(() => response))),
      );
  }
}
