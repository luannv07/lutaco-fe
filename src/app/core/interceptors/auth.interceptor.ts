import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApiEndpoints } from '../../shared/constants/api.constants';
import { AuthService } from '../services/auth.service'; // Import AuthService

// The key for storing the JWT in localStorage.
const TOKEN_STORAGE_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// List of API endpoints that do not require an authentication token.
const PUBLIC_API_ENDPOINTS: string[] = [
  ApiEndpoints.AUTH.LOGIN,
  ApiEndpoints.AUTH.REGISTER,
  ApiEndpoints.AUTH.REFRESH_TOKEN,
];

let isRefreshingToken = false;
const refreshTokenSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);

// This interceptor attaches JWT and language headers to requests.
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const translateService = inject(TranslateService);
  const router = inject(Router);
  const authService = inject(AuthService); // Inject AuthService

  // Ensure currentLang is always a string, defaulting to 'vi' if not set
  const currentLang: string = translateService.currentLang || translateService.defaultLang || 'vi';

  // Helper function to add authorization header
  const addTokenHeader = (request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
    let headers = request.headers;
    headers = headers.set('Accept-Language', currentLang); // Always set language header

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return request.clone({ headers });
  };

  // Get the JWT token from local storage.
  const token = authService.getToken();
  const isPublicApi = PUBLIC_API_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  let authReq = req;
  if (!isPublicApi) {
    authReq = addTokenHeader(req, token);
  } else {
    // For public APIs, just add language header
    authReq = req.clone({ headers: req.headers.set('Accept-Language', currentLang) });
  }


  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && error.error?.errorCode === 'UNAUTHORIZED' && !isPublicApi) {
        // If 401 and not a public API, attempt to refresh token
        if (!isRefreshingToken) {
          isRefreshingToken = true;
          refreshTokenSubject.next(null); // Clear previous token

          return authService.refreshToken().pipe(
            switchMap((response) => {
              isRefreshingToken = false;
              refreshTokenSubject.next(response.data?.accessToken); // Set new access token
              return next(addTokenHeader(req, response.data?.accessToken || null)); // Retry original request with new token
            }),
            catchError((refreshError) => {
              isRefreshingToken = false;
              authService.clearTokens();
              router.navigate(['/auth/login']);
              return throwError(() => refreshError); // Re-throw refresh error
            })
          );
        } else {
          // If token is already being refreshed, queue the request
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
              return next(addTokenHeader(req, token)); // Retry original request with new token
            })
          );
        }
      }
      // For other errors or if it's a public API 401, just re-throw
      return throwError(() => error);
    })
  );
};
