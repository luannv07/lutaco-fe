import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslationLoaderService } from './translation-loader.service';
import { map, Observable } from 'rxjs';

const LANG_STORAGE_KEY = 'current_lang';
@Injectable({ providedIn: 'root' })
export class LanguageService {
  public readonly availableLangs = ['en', 'vi'];
  private translate = inject(TranslateService);
  private translationLoader = inject(TranslationLoaderService);
  private platformId = inject(PLATFORM_ID); // ← Thêm

  constructor() {
    this.initLanguage();
  }

  public setLanguage(lang: string): void {
    if (!this.availableLangs.includes(lang)) {
      lang = 'vi';
    }
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      // ← Guard localStorage
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  }

  public getCurrentLanguage(): string {
    return this.translate.currentLang || 'vi';
  }

  private initLanguage(): void {
    let defaultLang = 'vi';

    if (isPlatformBrowser(this.platformId)) {
      // ← Guard navigator + localStorage
      const browserLang = navigator.language.match(/en|vi/) ? navigator.language : 'vi';
      const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
      defaultLang = storedLang || browserLang || 'vi';
    }

    this.translate.addLangs(this.availableLangs);
    this.setLanguage(defaultLang);
  }

  public loadTranslationModules(lang: string, modulePaths: string[]): Observable<any> {
    return this.translationLoader.loadMultipleTranslationFiles(lang, modulePaths).pipe(
      map((mergedTranslations) => {
        this.translate.setTranslation(lang, mergedTranslations, true);
        return mergedTranslations;
      }),
    );
  }
}
