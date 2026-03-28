import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationLoaderService } from './translation-loader.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Key for storing the selected language in local storage
const LANG_STORAGE_KEY = 'current_lang';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  // List of available languages
  public readonly availableLangs = ['en', 'vi'];
  private translate = inject(TranslateService);
  private translationLoader = inject(TranslationLoaderService);

  constructor() {
    this.initLanguage();
  }

  /**
   * Sets the active language for the application.
   * This will trigger ngx-translate to use the new language.
   * @param lang The language code to set (e.g., 'en', 'vi').
   */
  public setLanguage(lang: string): void {
    if (!this.availableLangs.includes(lang)) {
      console.warn(`Language '${lang}' is not supported. Falling back to default.`);
      // Use getFallbackLang() if available, otherwise 'vi'
      lang = (this.translate.getFallbackLang() as string) || 'vi';
    }
    this.translate.use(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }

  /**
   * Gets the currently active language.
   * @returns The current language code.
   */
  public getCurrentLanguage(): string {
    // Ensure the returned value is always a string.
    // Use getFallbackLang() if available, otherwise 'vi'
    return this.translate.currentLang || (this.translate.getFallbackLang() as string) || 'vi';
  }

  /**
   * Loads translations for a specific set of module paths and language.
   * This is useful for lazy-loading modules or domain-specific translations.
   * @param lang The language to load.
   * @param modulePaths An array of module paths (e.g., ['auth', 'products']).
   * @returns An Observable that completes when translations are loaded.
   */
  public loadTranslationModules(lang: string, modulePaths: string[]): Observable<any> {
    return this.translationLoader.loadMultipleTranslationFiles(lang, modulePaths).pipe(
      map((mergedTranslations) => {
        // Merge all loaded translations into the current translation service store
        this.translate.setTranslation(lang, mergedTranslations, true); // Merge, don't overwrite
        return mergedTranslations;
      }),
    );
  }

  /**
   * Initializes the language for the application.
   * It tries to use the language from localStorage, otherwise falls back to 'vi' (from fallbackLang).
   * It also adds available languages to ngx-translate.
   */
  private initLanguage(): void {
    const browserLang = navigator.language.match(/en|vi/) ? navigator.language : 'vi';
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
    // Ensure defaultLang is always a string, using 'vi' as ultimate fallback
    const defaultLang: string = storedLang || browserLang || 'vi';

    this.translate.addLangs(this.availableLangs);
    // Removed: this.translate.setDefaultLang('vi'); as fallbackLang is used in app.config.ts

    this.setLanguage(defaultLang);
  }
}
