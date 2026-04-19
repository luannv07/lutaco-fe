import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslationLoaderService } from './translation-loader.service';
import { map, Observable, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

const LANG_STORAGE_KEY = 'current_lang';

// Config-driven: Define supported languages and defaults (NOT hardcoded in methods)
export const LANGUAGE_CONFIG = {
  supported: ['en', 'vi'],
  default: 'en',
  translationModules: ['common', 'dashboard', 'auth'],
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public readonly availableLangs = LANGUAGE_CONFIG.supported;
  private translate = inject(TranslateService);
  public currentLang = toSignal(
    this.translate.onLangChange.pipe(
      map((e) => e.lang),
      startWith(this.getCurrentLanguage()),
    ),
    { initialValue: this.getCurrentLanguage() },
  );
  private translationLoader = inject(TranslationLoaderService);
  private platformId = inject(PLATFORM_ID);

  // Cache for translation promises to deduplicate parallel requests
  private loadingPromises = new Map<string, Promise<void>>();
  private langChangeSubscription: any;

  constructor() {
    this.initLanguage();
  }

  /**
   * Initialize languages with dual-language preload strategy
   * Loads CURRENT + FALLBACK language for all configured modules
   */
  async initializeLanguages(): Promise<void> {
    const currentLang = this.getCurrentLanguage();
    const fallbackLang = LANGUAGE_CONFIG.default;

    // Preload current + fallback languages for all modules
    await this.preloadLanguagePair(currentLang, fallbackLang, LANGUAGE_CONFIG.translationModules);
    this.subscribeToLanguageChanges();
  }

  /**
   * Preload a pair of languages (current + fallback) for given modules
   * Uses config instead of hardcoding languages
   */
  private async preloadLanguagePair(
    primaryLang: string,
    secondaryLang: string,
    modules: string[]
  ): Promise<void> {
    const promises = [];

    for (const module of modules) {
      // Load primary language
      promises.push(this.loadLanguageModule(primaryLang, module));

      // Load secondary language (fallback) if different from primary
      if (primaryLang !== secondaryLang) {
        promises.push(this.loadLanguageModule(secondaryLang, module));
      }
    }

    await Promise.all(promises);
  }

  /**
   * Load a single language module with deduplication
   * Uses promise cache to prevent duplicate parallel requests
   */
  private async loadLanguageModule(lang: string, module: string): Promise<void> {
    const key = `${lang}:${module}`;

    // Return cached promise if already loading
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)!;
    }

    // Create new loading promise
    const promise = new Promise<void>((resolve) => {
      this.translationLoader.loadTranslationFile(lang, module).subscribe(() => {
        this.loadingPromises.delete(key); // Clean up after load
        resolve();
      });
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  private subscribeToLanguageChanges(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }

    this.langChangeSubscription = this.translate.onLangChange.subscribe(async () => {
      await this.reloadForLanguage();
    });
  }

  async reloadForLanguage(): Promise<void> {
    const currentLang = this.translate.currentLang;
    const fallbackLang = LANGUAGE_CONFIG.default;

    // Reload with dual-language strategy
    await this.preloadLanguagePair(currentLang, fallbackLang, LANGUAGE_CONFIG.translationModules);

    // Hook for extension
    await this.onAfterLanguageReload();
  }

  protected async onAfterLanguageReload(): Promise<void> {
    // Override if needed
  }

  /**
   * Load translation modules for a given language (route-specific)
   */
  public loadTranslationModules(lang: string, modulePaths: string[]): Observable<any> {
    return this.translationLoader.loadMultipleTranslationFiles(lang, modulePaths);
  }

  /**
   * Switch language - uses config-driven fallback
   */
  public setLanguage(lang: string): void {
    // Validate language against config
    if (!LANGUAGE_CONFIG.supported.includes(lang)) {
      lang = LANGUAGE_CONFIG.default;
    }

    this.translate.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  }

  /**
   * Get current language with fallback chain
   */
  public getCurrentLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Check localStorage
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored && LANGUAGE_CONFIG.supported.includes(stored)) {
        return stored;
      }

      // 2. Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (LANGUAGE_CONFIG.supported.includes(browserLang)) {
        return browserLang;
      }
    }

    // 3. Default from config
    return LANGUAGE_CONFIG.default;
  }

  private initLanguage(): void {
    const defaultLang = this.getCurrentLanguage();

    this.translate.addLangs(LANGUAGE_CONFIG.supported);
    this.setLanguage(defaultLang);
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    // Clean up promise cache
    this.loadingPromises.clear();
  }
}

