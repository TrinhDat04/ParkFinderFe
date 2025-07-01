import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    setItem(key: string, value: any): void {
        if (isPlatformBrowser(this.platformId)) {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
        }
    }

    getItem(key: string): any {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }
        const value = localStorage.getItem(key);
        try {
            return value ? JSON.parse(value) : null;
        } catch (e) {
            return value;
        }
    }

    removeItem(key: string): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        localStorage.removeItem(key);
    }

    clear(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        localStorage.clear();
    }
}
