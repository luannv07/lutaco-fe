import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export enum LOCAL_STORAGE_KEY {
  TOKEN_STORAGE_KEY = 'access_token',
  REFRESH_TOKEN_KEY = 'refresh_token',
  USER_INFO_KEY = 'user_info',
}
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    const rawValue = localStorage.getItem(key);
    if (rawValue === null) return null;

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return rawValue as T;
    }
  }

  add<T>(key: string, value: T): boolean {
    if (!this.isBrowser || this.has(key)) return false;

    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  update<T>(key: string, value: T): boolean {
    if (!this.isBrowser || !this.has(key)) return false;

    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;

    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(key);
  }

  has(key: string): boolean {
    if (!this.isBrowser) return false;

    return localStorage.getItem(key) !== null;
  }

  clear(): void {
    if (!this.isBrowser) return;

    localStorage.clear();
  }
}
