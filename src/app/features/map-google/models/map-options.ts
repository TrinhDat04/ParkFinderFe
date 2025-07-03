export interface CustomMapOptions {
  styles?: google.maps.MapTypeStyle[];
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  disableDefaultUI?: boolean;
}
