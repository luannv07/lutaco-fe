import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslationLoaderService } from './translation-loader.service';
import { map, Observable, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

const LANG_STORAGE_KEY = 'current_lang';
@Injectable({ providedIn: 'root' })
export class LanguageService {
  public readonly availableLangs = ['en', 'vi'];
  private translate = inject(TranslateService);
  private translationLoader = inject(TranslationLoaderService);
  private platformId = inject(PLATFORM_ID); // ← Thêm
  private loadedModules = new Set<string>();

  public loadTranslationModules(lang: string, modulePaths: string[]): Observable<any> {
    // Lưu lại module đã load
    modulePaths.forEach((m) => this.loadedModules.add(m));

    return this.translationLoader.loadMultipleTranslationFiles(lang, modulePaths).pipe(
      map((mergedTranslations) => {
        this.translate.setTranslation(lang, mergedTranslations, true);
        return mergedTranslations;
      }),
    );
  }

  public setLanguage(lang: string): void {
    if (!this.availableLangs.includes(lang)) {
      lang = 'vi';
    }

    // Reload tất cả module đã load với ngôn ngữ mới
    if (this.loadedModules.size > 0) {
      this.loadTranslationModules(lang, Array.from(this.loadedModules)).subscribe();
    }

    this.translate.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  }
  public currentLang = toSignal(
    this.translate.onLangChange.pipe(
      map((e) => e.lang),
      startWith(this.getCurrentLanguage()),
    ),
    { initialValue: this.getCurrentLanguage() },
  );
  constructor() {
    this.initLanguage();
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
}
