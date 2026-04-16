import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

const DEFAULT_TIMEOUT_MS = 15000;

export const REQUEST_TIMEOUT_MS = new HttpContextToken<number>(() => DEFAULT_TIMEOUT_MS);

function getErrorMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string') {
    return error.error;
  }

  if (
    typeof error.error === 'object' &&
    error.error !== null &&
    'message' in error.error &&
    typeof error.error.message === 'string'
  ) {
    return error.error.message;
  }

  return error.message;
}

function isBackendTimeout(error: HttpErrorResponse): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return error.status === 500 && message.includes('timeout');
}

function createTimeoutHttpError(url: string | null): HttpErrorResponse {
  return new HttpErrorResponse({
    status: 408,
    statusText: 'Request Timeout',
    url: url ?? undefined,
    error: {
      errorCode: 'REQUEST_TIMEOUT',
      message: 'Request timeout. Please try again.',
    },
  });
}

export const requestTimeoutInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const timeoutMs = req.context.get(REQUEST_TIMEOUT_MS);

  return next(req).pipe(
    timeout(timeoutMs),
    catchError((error: unknown) => {
      if (error instanceof TimeoutError) {
        return throwError(() => createTimeoutHttpError(req.url));
      }

      if (error instanceof HttpErrorResponse && isBackendTimeout(error)) {
        return throwError(() => createTimeoutHttpError(error.url ?? req.url));
      }

      return throwError(() => error);
    }),
  );
};

