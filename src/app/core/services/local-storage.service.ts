import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export enum LOCAL_STORAGE_KEY {
  TOKEN_STORAGE_KEY = 'access_token',
  REFRESH_TOKEN_KEY = 'refresh_token',
  USER_INFO_KEY = 'user_info',
  SIDEBAR_COLLAPSED_KEY = 'sidebar_collapsed',
}
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private serialize<T>(value: T): string {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }

  private deserialize<T>(rawValue: string): T {
    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return rawValue as T;
    }
  }

  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    const rawValue = localStorage.getItem(key);
    if (rawValue === null) return null;

    return this.deserialize<T>(rawValue);
  }

  add<T>(key: string, value: T): boolean {
    if (!this.isBrowser || this.has(key)) return false;

    localStorage.setItem(key, this.serialize(value));
    return true;
  }

  update<T>(key: string, value: T): boolean {
    if (!this.isBrowser || !this.has(key)) return false;

    localStorage.setItem(key, this.serialize(value));
    return true;
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;

    localStorage.setItem(key, this.serialize(value));
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
