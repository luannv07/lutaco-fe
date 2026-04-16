import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { requestTimeoutInterceptor } from './core/interceptors/request-timeout.interceptor';
import { TranslationLoaderService } from './core/i18n/translation-loader.service';
import { LanguageService } from './core/i18n/language.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslationLoaderService(http);
}

// Factory function for APP_INITIALIZER
export function initializeApp(langService: LanguageService) {
  return () => {
    const lang = langService.getCurrentLanguage();
    // Load 'common' translations on startup
    return langService.loadTranslationModules(lang, ['common']);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, requestTimeoutInterceptor]), withFetch()),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      fallbackLang: 'vi',
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [LanguageService],
      multi: true,
    },
  ],
};
