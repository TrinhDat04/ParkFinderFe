import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { ENVIRONMENT } from '../../../../../environments/environment';
import { MAP_ENDPOINTS } from '../../../../core/constants/endpoints/map-endpoints';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private map!: mapboxgl.Map;
  private geolocate!: mapboxgl.GeolocateControl;
  private userCoords: number[] | null = null;
  private pinCoords: number[] | null = null;

  constructor() {}

  ngOnInit() {
    this.Init();
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

    this.map.on('click', (event) => {
      const { lng, lat } = event.lngLat;
      console.log('User clicked at:', { longitude: lng, latitude: lat });
    });

    this.map.on('click', 'points', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['points'],
      });

      if (features.length) {
        const props = features[0].properties;
        const geometry = features[0].geometry;
        if (geometry.type == 'Point') {
          const coors = [geometry.coordinates[0], geometry.coordinates[1]];

          console.log(props);

          if (props != null) {
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `
            <div style="color: #333; font-family: sans-serif; font-size: 14px;">
              <strong style="color: #2c7;">Name: ${props['Name']}</strong><br/>
              <span style="color: #555;">Description: ${props['Description']}</span><br/>
              <button id="navigate-btn" style="margin-top: 8px; cursor: pointer;">Navigate</button>
            </div>
          `
              )
              .addTo(this.map);

            setTimeout(() => {
              const btn = document.getElementById('navigate-btn');
              if (btn) {
                btn.addEventListener('click', () => {
                  if (!this.userCoords) {
                    alert('User location not available yet.');
                    return;
                  }
                  this.pinCoords = coors;
                  this.getRoute(this.userCoords, this.pinCoords);
                });
              }
            }, 100);
          }
        }
      }
    });

    this.map.on('mouseenter', 'points', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'points', () => {
      this.map.getCanvas().style.cursor = '';
    });

    this.geolocate.on('geolocate', (position: GeolocationPosition) => {
      this.userCoords = [
        position.coords.longitude,
        position.coords.latitude,
        position.coords.accuracy,
      ];
      console.log('User location:', {
        longitude: this.userCoords[0],
        latitude: this.userCoords[1],
        accuracy: this.userCoords[2],
      });
    });
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
