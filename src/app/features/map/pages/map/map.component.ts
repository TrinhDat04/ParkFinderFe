import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { ENVIRONMENT } from '../../../../../environments/environment';
import { MAP_ENDPOINTS } from '../../../../core/constants/endpoints/map-endpoints';
import { MapService } from '../../services/map.services';
import { ParkingLot } from '../../models/parking-lot';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private map!: mapboxgl.Map;
  private geolocate!: mapboxgl.GeolocateControl;
  private userCoords: number[] | null = null;
  private pinCoords: number[] | null = null;
  private mode: string = "";
  private tempFeature: any | null = null;
  protected selectedFeature: any = null;
  protected isNavigating = false;
  protected detailSelected: any = null;
  parkingLot?: ParkingLot;
  protected totalDistance: number = -1;
  protected totalTime: number = -1;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private mapService: MapService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.Init();
    }
  }

  Init(): void {
    mapboxgl.accessToken = ENVIRONMENT.mapboxAccessToken;

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: `${ENVIRONMENT.tileSetStyle}`,
      center: [105.70009820500417, 21.009999933398163] as [number, number],
      zoom: 15,
    });

    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    this.map.addControl(this.geolocate);

    this.map.on('load', () => {
      this.map.addSource('test_layer', {
        type: 'vector',
        tiles: [`${MAP_ENDPOINTS.tileSet}`],
        minzoom: 6,
        maxzoom: 14,
      });

      this.map.loadImage(
        '/assets/icons/sus.png',
        (error, image) => {
          if (error) throw error;
          if (image && !this.map.hasImage('icon')) {
            this.map.addImage('icon', image);
          }

          this.map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'test_layer',
            'source-layer': 'test_layer',
            layout: {
              'icon-image': 'icon',
              'icon-size': 0.17,
              'icon-anchor': 'bottom',
              'icon-allow-overlap': true,
            },
            filter: ['==', '$type', 'Point'],
          });

          this.map.addLayer({
            id: 'points-click-buffer',
            type: 'circle',
            source: 'test_layer',
            'source-layer': 'test_layer',
            paint: {
              'circle-radius': 45,
              'circle-opacity': 0,
            },
            filter: ['==', '$type', 'Point'],
          });
        }
      );

      this.geolocate.trigger();
    });

    this.geolocate.on('geolocate', (position) => {
      this.userCoords = [
        position.coords.longitude,
        position.coords.latitude,
        position.coords.accuracy,
      ];
    });

    this.map.on('mouseenter', 'points', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'points', () => {
      this.map.getCanvas().style.cursor = '';
    });

    this.map.on('load', () => this.setupClickEvents());
  }

  async setupClickEvents() {
    this.map.on('click', 'points-click-buffer', async (e) => {
      const feature = e.features?.[0];

      if (feature && feature.geometry.type === 'Point') {
        const coords = feature.geometry.coordinates as [number, number];
        const props = feature.properties;

        if (props) {
          this.selectedFeature = this.tempFeature = {
            coords: coords,
            properties: props,
          };

          const location: { lat: number; lng: number } = {
            lat: coords[1],
            lng: coords[0],
          };
          this.flyToLocation(location, 14);
        }
      }

      this.pinCoords = this.selectedFeature.coords;

      if (this.pinCoords && this.userCoords && this.selectedFeature) {
        const url = `${MAP_ENDPOINTS.getRoute(
          this.userCoords,
          this.pinCoords,
          this.mode
        )}`;
        const response = await fetch(url);
        const data = await response.json();

        this.totalDistance = data.routes[0].distance;
        this.totalTime = data.routes[0].duration;
      }
    });
  }

  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0 && mins > 0) {
      return `${hrs} giờ ${mins} phút`;
    } else if (hrs > 0) {
      return `${hrs} giờ`;
    } else if (mins > 0) {
      return `${mins} phút`;
    } else {
      return 'Ít hơn một phút';
    }
  }

  formatDistance(meters: number): string {
    const km = meters / 1000;
    const rounded = parseFloat(km.toFixed(1));
    return `${rounded} Km`;
  }

  closeDetailPanel(): void {
    this.selectedFeature = null;
  }

  startNavigation(): void {
    if (!this.userCoords || !this.selectedFeature) {
      alert('User location not available');
      return;
    }
    this.pinCoords = this.selectedFeature.coords;
    if (!this.pinCoords) {
      alert('Unable to locate destination');
      return;
    }
    this.getRoute(this.userCoords, this.pinCoords, this.mode);
  }

  async getRoute(userCoords: number[], pinCoords: number[], mode: string) {
    const url = `${MAP_ENDPOINTS.getRoute(userCoords, pinCoords, mode)}`;

    const response = await fetch(url);
    const data = await response.json();

    const route = data.routes[0].geometry;

    const lotId = this.selectedFeature?.properties?.ParkingLotId;

    const source = this.map.getSource('route') as mapboxgl.GeoJSONSource;

    const bounds = new mapboxgl.LngLatBounds();

    if (source) {
      source.setData({
        type: 'Feature',
        geometry: route,
        properties: {},
      });
    } else {
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: route,
          properties: {},
        },
      });

      this.map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });
      this.map.setFilter('points', ['==', ['get', 'ParkingLotId'], lotId]);

      this.map.setFilter('points-click-buffer', [
        '==',
        ['get', 'ParkingLotId'],
        lotId,
      ]);

      bounds.extend(userCoords as [number, number]);
      bounds.extend(pinCoords as [number, number]);

      this.map.fitBounds(bounds, {
        padding: 150,
        maxZoom: 15,
        duration: 1000,
      });
      this.closeDetailPanel();
      this.closeDetail();
      this.isNavigating = true;
    }
  }

  stopNavigation(): void {
    this.isNavigating = false;

    if (this.map.getLayer('route-line')) {
      this.map.removeLayer('route-line');
    }
    if (this.map.getSource('route')) {
      this.map.removeSource('route');
    }

    const baseFilter = ['==', '$type', 'Point'];
    this.map.setFilter('points', baseFilter);
    this.map.setFilter('points-click-buffer', baseFilter);

    const feature = this.tempFeature;
    if (feature) {
      const location: { lat: number; lng: number } = {
        lat: feature.coords[1],
        lng: feature.coords[0],
      };
      this.flyToLocation(location, 14);
    }
    this.tempFeature = null;
  }

  onSearchResult(location: { lat: number; lng: number }) {
    this.flyToLocation(location, 13);
  }

  flyToLocation(location: { lat: number; lng: number }, z: number) {
    if (this.map) {
      this.map.flyTo({
        center: [location.lng, location.lat],
        zoom: z,
      });
    }
  }

  showDetails() {
    this.detailSelected = true;
    const id = this.selectedFeature?.properties?.['ParkingLotId'];
    this.loadDetail(id!);
  }

  loadDetail(id: string) {
    this.mapService.getParkingLotDetail(id).subscribe({
      next: (data) => {
        this.parkingLot = data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu bãi đỗ xe', err);
      },
    });
  }

  closeDetail() {
    this.detailSelected = null;
    this.parkingLot = undefined;
  }
}
