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
import { MapDataService } from '../../services/map-google.service';

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrl: './map-google.component.css',
})
export class MapGoogleComponent implements AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private mapService: MapDataService
  ) {}

  private watchId!: number;
  private userLocation!: google.maps.LatLngLiteral;
  private center: { lat: number; lng: number } = {
    lat: 21.0285,
    lng: 105.8542,
  };
  private customMap: CustomMapOptions = {
    styles: [
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    ],
    center: this.center,
    zoom: 13,
    minZoom: 8,
    maxZoom: 20
  };

  protected apiLoaded: boolean = false;

  protected markers: google.maps.LatLngLiteral[] = [];

  protected markerIcon: any;

  protected customMapOptions: google.maps.MapOptions = {
    ...this.customMap,
    gestureHandling: 'auto',
  };

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

    await Promise.all([this.fetchMapData()]);

    this.apiLoaded = true;
  }

  async fetchMapData() {
    this.mapService.getGeoJson().subscribe((geo) => {
      this.createMarker(geo);
    });
  }

  async createMarker(geojson: any) {
    this.markerIcon = {
      url: 'assets/icons/sus.png',
      scaledSize: new google.maps.Size(40, 40),
    };
    this.markers = geojson.features.map((f: any) => {
      const [lng, lat] = f.geometry.coordinates;
      return { lat, lng };
    });
  }

  getUserLocation() {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported.');
      return;
    }
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
