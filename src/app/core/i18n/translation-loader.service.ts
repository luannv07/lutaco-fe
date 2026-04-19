import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

// Defines the structure for a module to be loaded
interface TranslationModuleConfig {
  name: string; // e.g., 'common', 'auth'
  fileName: string; // e.g., 'common', 'auth' (name of the JSON file without .json extension)
}

@Injectable({
  providedIn: 'root',
})
export class TranslationLoaderService implements TranslateLoader {
  // Base path for translation files
  private readonly basePath = '/assets/i18n/';
  private platformId = inject(PLATFORM_ID); // ← Thêm

  // List of modules to load by default when the application starts.
  // These are typically common or core translations.
  private readonly initialModules: TranslationModuleConfig[] = [
    { name: 'common', fileName: 'common' },
    { name: 'profile', fileName: 'profile' },
  ];

  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  /**
   * Loads a single translation file for a given language and module file name.
   * @param lang The language code (e.g., 'en', 'vi').
   * @param fileName The name of the translation JSON file (e.g., 'common', 'auth').
   * @returns An Observable with the translation object for that module.
   */
  public loadTranslationFile(lang: string, fileName: string): Observable<any> {
    const cacheKey = `${lang}:${fileName}`;

    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)); // ← Trả về cache, không gọi HTTP
    }

    return this.http.get(`${this.basePath}${lang}/${fileName}.json`).pipe(
      tap((data) => this.cache.set(cacheKey, data)), // ← Lưu vào cache
      catchError(() => of({})),
    );
  }
  /**
   * Loads multiple translation files for a given language and module file names, then merges them.
   * @param lang The language code.
   * @param fileNames An array of translation JSON file names (e.g., ['auth', 'products']).
   * @returns An Observable with the merged translations for the specified modules.
   */
  public loadMultipleTranslationFiles(lang: string, fileNames: string[]): Observable<any> {
    if (!fileNames || fileNames.length === 0) {
      return of({});
    }

    const requests = fileNames.map((fileName) => this.loadTranslationFile(lang, fileName));

    return forkJoin(requests).pipe(
      map((responses) => {
        // Merge all responses into a single object
        return responses.reduce((acc, response) => ({ ...acc, ...response }), {});
      }),
    );
  }

  /**
   * This is the main method that ngx-translate calls to get translations.
   * It loads all defined `initialModules` for the given language and merges them.
   * @param lang The language code (e.g., 'en', 'vi').
   * @returns An Observable with the merged initial translations.
   */
  getTranslation(lang: string): Observable<any> {
    // Server không load được file → trả về rỗng, client sẽ load lại
    if (!isPlatformBrowser(this.platformId)) {
      return of({});
    }

    return this.loadMultipleTranslationFiles(
      lang,
      this.initialModules.map((m) => m.fileName),
    );
  }
}
