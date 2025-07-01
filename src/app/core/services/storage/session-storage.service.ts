import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  setItem(key: string, value: any): void {
    try {
      const stringifiedValue = JSON.stringify(value);
      sessionStorage.setItem(key, stringifiedValue);
    } catch (error) {
      console.error('Error saving to sessionStorage', error);
    }
  }
  getItem(key: string): any {
    try {
      const storedValue = sessionStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error('Error retrieving from sessionStorage', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from sessionStorage', error);
    }
  }

  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage', error);
    }
  }
}
