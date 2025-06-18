import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { ENVIRONMENT } from '../../../../../environments/environment';
import { MAP_ENDPOINTS } from '../../../../core/constants/endpoints/map-endpoints';

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
  protected panelHeight = 100; 
  protected dragStartY = 0;
  protected isDragging = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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

      this.map.loadImage('/assets/icons/sus.png', (error, image) => {
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
            'icon-size': 0.12,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true,
          },
          filter: ['==', '$type', 'Point'],
        });
      });

      this.geolocate.trigger();
    });

    this.geolocate.on("geolocate", (position) => {
      this.userCoords = [
        position.coords.longitude,
        position.coords.latitude,
        position.coords.accuracy,
      ];
    });

    // this.map.on('click', (event) => {
    //   const { lng, lat } = event.lngLat;
    //   console.log('User clicked at:', { longitude: lng, latitude: lat });
    // });

    this.map.on('mouseenter', 'points', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'points', () => {
      this.map.getCanvas().style.cursor = '';
    });

    this.map.on('load', () => this.setupClickEvents());
  }

  setupClickEvents(): void {
    this.map.on('click', 'points', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['points'],
      });

      if (features.length) {
        const props = features[0].properties;
        const geometry = features[0].geometry;
        if (geometry.type == 'Point') {
          const coors = [geometry.coordinates[0], geometry.coordinates[1]];
          if (props != null) {
            this.selectedFeature = {
              name: props['Name'],
              description: props['Description'],
              coords: coors,
            };
          }
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

    const source = this.map.getSource('route') as mapboxgl.GeoJSONSource;

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
    }
  }
}
