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
import { lastValueFrom } from 'rxjs';
import { ENVIRONMENT } from '../../../../../environments/environment';
import { MapsLibLoaderService } from '../../services/map-google-lib-loader.service';

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrl: './map-google.component.css',
})
export class MapGoogleComponent implements AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private mapService: MapDataService,
    private libLoader: MapsLibLoaderService
  ) {}

  private watchId!: number;
  private userLocation!: google.maps.LatLngLiteral;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private tempFeature: any = null;
  private center: { lat: number; lng: number } = {
    lat: 21.009999933398163,
    lng: 105.70009820500417,
  };
  private customMap: CustomMapOptions = {
    center: this.center,
    zoom: 14,
    minZoom: 8,
    maxZoom: 20,
  };

  protected apiLoaded: boolean = false;
  protected markers: google.maps.Marker[] = [];
  protected markerIcon: any;
  protected selectedFeature: any = null;
  protected showInfoPanel: boolean = false;
  protected userLocationPuck?: google.maps.marker.AdvancedMarkerElement;
  protected detailSelected?: any = null;
  protected totalDistance?: string;
  protected totalTime?: string;
  protected isNavigating?: boolean = false;
  protected customMapOptions: google.maps.MapOptions = {
    ...this.customMap,
    gestureHandling: 'auto',
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: ENVIRONMENT.googleMapId,
  };

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.libLoader.loadLibraries().then(() => {
      this.apiLoaded = true;
      this.initMap();
    });
  }

  async initMap() {
    if (!window.google?.maps?.importLibrary) {
      console.error('Google Maps JS API is not available.');
      return;
    }

    await this.libLoader.loadLibraries();

    try {
      this.getUserLocation();
      this.watchUserLocation();
    } catch (err) {
      console.warn(err);
    }

    await this.fetchMapData();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeOpacity: 0.8,
        strokeWeight: 6,
      },
    });
    this.directionsRenderer.setMap(this.map.googleMap!);
  }

  async fetchMapData() {
    try {
      const geo = await lastValueFrom(this.mapService.getGeoJson());

      if (!geo || !geo.features || !Array.isArray(geo.features)) {
        throw new Error('Invalid GeoJSON structure');
      }

      this.createMarker(geo);
    } catch (err) {
      console.error('Error fetching or parsing GeoJSON:', err);
    }
  }

  createMarker(geojson: any) {
    this.markers = geojson.features
      .map((f: any) => {
        const [lngRaw, latRaw] = f.geometry.coordinates;
        const lat = Number(latRaw);
        const lng = Number(lngRaw);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn('Invalid lat/lng:', f.geometry.coordinates);
          return null;
        }

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: this.map.googleMap,
          icon: {
            url: 'assets/icons/parking_lot_icon.png',
            scaledSize: new google.maps.Size(40, 50),
          },
          clickable: true,
        });

        marker.set('feature', f);

        marker.addListener('click', () => {
          this.showFeatureInfo(marker);
        });

        return marker;
      })
      .filter((m: google.maps.Marker): m is google.maps.Marker => m !== null);
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

  watchUserLocation() {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported.');
      return;
    }

    if (this.watchId != null) {
      return;
    }
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: google.maps.LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.userLocation = coords;

        if (!this.userLocationPuck) {
          this.createUserPuckMarker(coords);
        } else {
          this.userLocationPuck.position = coords;
        }
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

  createUserPuckMarker(position: google.maps.LatLngLiteral) {
    const div = document.createElement('div');
    div.className = 'user-location-puck';
    div.innerHTML = `
      <div class="user-location-puck">
        <div class="pulse"></div>
        <div class="center-icon"></div>
      </div>
    `;

    this.userLocationPuck = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: div,
      map: this.map.googleMap!,
    });
  }

  startNavigation() {
    if (!this.userLocation || !this.selectedFeature) return;

    const destinationCoords = this.selectedFeature.geometry.coordinates;
    const [lng, lat] = destinationCoords;

    const request: google.maps.DirectionsRequest = {
      origin: this.userLocation,
      destination: { lat: Number(lat), lng: Number(lng) },
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.markers.forEach((m) => {
      if (m.get('feature') !== this.selectedFeature) {
        m.setMap(null);
      }
    });
    this.directionsService.route(request, (result, status) => {
      if (status === 'OK' && result) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.warn('Directions request failed:', status);
      }
    });

    this.tempFeature = this.selectedFeature;
    this.closeDetailPanel();
    this.isNavigating = true;
  }

  calculateRoute(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral
  ) {
    this.directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const leg = result.routes[0].legs[0];
          this.totalDistance = leg.distance?.text ?? '';
          this.totalTime = leg.duration?.text ?? '';
        } else {
          console.warn('Directions request failed:', status);
          this.totalDistance = '';
          this.totalTime = '';
        }
      }
    );
  }

  showFeatureInfo(marker: any) {
    const feature = marker.get('feature');
    if (feature) {
      this.selectedFeature = feature;
      this.detailSelected = false;
      const destination = marker.getPosition()?.toJSON();
      if (this.userLocation && destination) {
        this.calculateRoute(this.userLocation, destination);
      }
      this.map.googleMap?.panTo(marker.getPosition()!);
    }
  }

  showDetails() {}

  closeDetailPanel() {
    this.selectedFeature = null;
  }

  stopNavigation() {
    this.directionsRenderer.set('directions', null);
    this.isNavigating = false;
    const [lng, lat] = this.tempFeature.geometry.coordinates;
    const tempMarker = new google.maps.Marker({
      position: { lat: Number(lat), lng: Number(lng) },
    });
    tempMarker.set('feature', this.tempFeature);
    this.showFeatureInfo(tempMarker);
    this.markers.forEach((m) => m.setMap(this.map.googleMap!));
    this.tempFeature = null;
  }

  onSearchResult(location: { lat: number; lng: number }) {
    this.map.panTo(location);
    this.map.googleMap?.setZoom(16);
  }
}
