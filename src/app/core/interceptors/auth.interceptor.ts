import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ApiEndpoints } from '../../shared/constants/api.constants';

// The key for storing the JWT in localStorage.
const TOKEN_STORAGE_KEY = 'access_token';

// List of API endpoints that do not require an authentication token.
const PUBLIC_API_ENDPOINTS: string[] = [
  ApiEndpoints.AUTH.LOGIN,
  ApiEndpoints.AUTH.REGISTER,
  ApiEndpoints.AUTH.REFRESH_TOKEN,
];

// This interceptor attaches JWT and language headers to requests.
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const translateService = inject(TranslateService);
  // Ensure currentLang is always a string, defaulting to 'vi' if not set
  const currentLang: string = translateService.currentLang || translateService.defaultLang || 'vi';

  // Get the JWT token from local storage.
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  // Check if the request is for a public API.
  const isPublicApi = PUBLIC_API_ENDPOINTS.some(endpoint => req.url.includes(endpoint));

  // Clone the request to add headers.
  let headers = req.headers;

  // Add Accept-Language header
  headers = headers.set('Accept-Language', currentLang);

  // Add Authorization header if it's a protected API and token exists
  if (!isPublicApi && token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({ headers });

  return next(authReq);
};
