import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MapsLibLoaderService {
  private loadPromise: Promise<void> | null = null;

  loadLibraries(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      if (!window.google?.maps?.importLibrary) {
        throw new Error('Google Maps JS API is not available');
      }
      await google.maps.importLibrary('maps');
      await google.maps.importLibrary('marker');
      await google.maps.importLibrary('places');
    })();

    return this.loadPromise;
  }
}
