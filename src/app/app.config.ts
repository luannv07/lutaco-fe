import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations'; // Reverted to provideAnimations
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { TranslationLoaderService } from './core/i18n/translation-loader.service';
import { LanguageService } from './core/i18n/language.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // Reverted to provideAnimations
    // Ensure Zone.js-based change detection is provided
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // ngx-translate configuration
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslationLoaderService, // Use our custom loader
          deps: [HttpClient],
        },
        // Use fallbackLang instead of defaultLanguage to avoid deprecation warning
        // The first language in the array is the primary fallback, others are secondary.
        fallbackLang: 'vi',
      }),
    ),
    LanguageService, // Initialize LanguageService to set up the language
  ],
};
