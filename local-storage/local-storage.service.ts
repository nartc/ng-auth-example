import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  localStorage!: Storage;
  isEnabled = false;

  constructor() {
    if (!window.localStorage) {
      this.isEnabled = false;
      console.error('Current browser does not support Local Storage');
      return;
    }
    this.isEnabled = true;
    this.localStorage = window.localStorage;
  }

  set(key: string, value: string): void {
    if (this.isEnabled) {
      this.localStorage.setItem(key, value);
    }
  }

  get(key: string): string {
    if (!this.isEnabled) {
      return '';
    }

    return this.localStorage.getItem(key) || '';
  }

  setObject(key: string, value: unknown): void {
    if (!this.isEnabled) {
      return;
    }
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  getObject<TType = unknown>(key: string): TType | null {
    if (!this.isEnabled) {
      return null;
    }
    return JSON.parse(this.localStorage.getItem(key) || null) as TType;
  }

  remove(key: string): void {
    if (!this.isEnabled) {
      return;
    }
    this.localStorage.removeItem(key);
  }

  clear(): void {
    this.localStorage.clear();
  }
}
