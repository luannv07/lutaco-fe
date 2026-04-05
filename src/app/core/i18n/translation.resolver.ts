import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { LanguageService } from './language.service';

export function translationResolver(...modules: string[]): ResolveFn<any> {
  return () => {
    const platformId = inject(PLATFORM_ID);

    // Skip trên server, client sẽ load lại sau khi hydrate
    if (!isPlatformBrowser(platformId)) {
      return of({});
    }

    const langService = inject(LanguageService);
    return langService.loadTranslationModules(langService.getCurrentLanguage(), modules);
  };
}
