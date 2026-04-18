import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, NgZone, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { UiLoadingService } from '../../shared/services/ui-loading.service';

function shouldTrackLoading(request: HttpRequest<unknown>): boolean {
  return !request.url.includes('/assets/i18n/');
}

export const uiStateInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const platformId = inject(PLATFORM_ID);
  const loadingService = inject(UiLoadingService);
  const ngZone = inject(NgZone);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const trackLoading = shouldTrackLoading(req);
  if (trackLoading) {
    loadingService.startRequest();
  }

  return next(req).pipe(
    map((event) => ngZone.run(() => event)),
    catchError((error: unknown) => throwError(() => ngZone.run(() => error))),
    finalize(() => {
      if (trackLoading) {
        ngZone.run(() => loadingService.finishRequest());
      }
    }),
  );
};
