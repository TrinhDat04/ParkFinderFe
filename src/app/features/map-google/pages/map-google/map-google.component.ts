import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { CustomMapOptions } from '../../models/map-options';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrl: './map-google.component.css',
})
export class MapGoogleComponent implements AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  private watchId!: number;
  private userLocation!: google.maps.LatLngLiteral;
  private center: { lat: number; lng: number } = {
    lat: 21.01380025467188,
    lng: 105.5254893092536,
  };
  private customMap: CustomMapOptions = {
    styles: [
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    ],
    center: this.center,
    zoom: 15,
  };

  protected apiLoaded: boolean = false;

  protected customMapOptions: google.maps.MapOptions = {
    ...this.customMap,
    gestureHandling: 'auto',
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initMap();
  }

  async initMap() {
    if (!window.google?.maps?.importLibrary) {
      console.error('Google Maps JS API is not available.');
      return;
    }
    await google.maps.importLibrary('maps');
    try {
      this.getUserLocation();
    } catch (err) {
      console.warn(err);
    }
    this.apiLoaded = true;
  }

  getUserLocation() {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported.');
      return;
    }

    console.log('Requesting geolocation...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: google.maps.LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.userLocation = coords;
        this.center = coords;

        this.map.panTo(this.userLocation);
      },
      (error) => {
        console.error('Geolocation error:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  watchingUserLocation() {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported.');
      return;
    }

    if (this.watchId != null) {
      return;
    }
    console.log('Requesting geolocation...');
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: google.maps.LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.userLocation = coords;
      },
      (error) => {
        console.error('Geolocation error:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  stopWatchingUserLocation() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
}
