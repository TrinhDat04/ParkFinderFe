import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { ENVIRONMENT } from '../../../../../environments/environment';
import { MAP_ENDPOINTS } from '../../../../core/constants/endpoints/map-endpoints';
import {MapService} from '../../services/map.services';
import {ParkingLot} from '../../models/parking-lot';

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
  protected selectedFeature: any = null;
  protected isNavigating = false;
  protected detailSelected: any = null;
  parkingLot?: ParkingLot;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private mapService: MapService) {}

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
        '/assets/icons/parking_lot_pin.png',
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

  setupClickEvents(): void {
    this.map.on('click', 'points-click-buffer', (e) => {
      const feature = e.features?.[0];

      console.log(feature);

      if (feature && feature.geometry.type === 'Point') {
        const coords = feature.geometry.coordinates as [number, number];
        const props = feature.properties;

        if (props) {
          this.selectedFeature = {
            coords: coords,
            properties: props,
          };
        }
      }
    });
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
    this.getRoute(this.userCoords, this.pinCoords);
  }

  async getRoute(userCoords: number[], pinCoords: number[]) {
    const url = `${MAP_ENDPOINTS.getRoute(userCoords, pinCoords)}`;

    const response = await fetch(url);
    const data = await response.json();

    const route = data.routes[0].geometry;

    const lotId = this.selectedFeature?.properties?.id;

    const source = this.map.getSource('route') as mapboxgl.GeoJSONSource;

    const bounds = new mapboxgl.LngLatBounds();

    console.log(this.map.getStyle().layers);

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
      this.map.setFilter('points', ['==', ['get', 'id'], lotId]);

      this.map.setFilter('points-click-buffer', [
        '==',
        ['get', 'id'],
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

    this.selectedFeature = null;
  }

  onSearchResult(location: { lat: number; lng: number }) {
    if (this.map) {
      this.map.flyTo({
        center: [location.lng, location.lat],
        zoom: 16,
      });
    }
  }

  showDetails() {
    this.detailSelected= true;
    const id = this.selectedFeature?.properties?.['id'];
    this.loadDetail(id!);
  }

  loadDetail(id: string) {
    this.mapService.getParkingLotDetail(id).subscribe({
      next: (data) => {
        this.parkingLot = data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu bãi đỗ xe', err);
      }
    });
  }
  closeDetail() {
    this.detailSelected = null;
    this.parkingLot = undefined;
  }
}
