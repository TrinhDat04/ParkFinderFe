import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private dbName = 'MyAppDatabase'; 
  private dbVersion = 1;

  constructor() { }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        // Create an object store (table) if it doesn't exist
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(target.error || 'An error occurred');
      };

      request.onsuccess = (event) => {
        const target = event.target as IDBRequest;
        resolve(target.result);
      }
    });
  }

  async addRecord(storeName: string, data: any): Promise<any> {
    const db = await this.openDB();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(target.error || 'An error occurred');
      };
    });
  }

  async getRecord(storeName: string, key: string): Promise<any> {
    const db = await this.openDB();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(target.error || 'An error occurred');
      };
    });
  }

  async deleteRecord(storeName: string, key: string): Promise<void> {
    const db = await this.openDB();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(target.error || 'An error occurred');
      };
    });
  }

  async clearStore(storeName: string): Promise<void> {
    const db = await this.openDB();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(target.error || 'An error occurred');
      };
    });
  }
}
