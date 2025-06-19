import { ENVIRONMENT } from '../../../../environments/environment';

export const MAP_ENDPOINTS = {
  tileSet: ENVIRONMENT.serviceUrl.tile + `/api/Tile/{z}/{x}/{y}.pbf`,
  getRoute: (userCoords: number[], pinCoords: number[]) =>
    `https://api.mapbox.com/directions/v5/mapbox/driving/${userCoords[0]},${userCoords[1]};${pinCoords[0]},${pinCoords[1]}?geometries=geojson&access_token=${ENVIRONMENT.mapboxAccessToken}`,
  getParkingLotLocation: (param: string) => ENVIRONMENT.serviceUrl.default + `/ParkingLot/search/${param}`,
  getParkingLotDetail: (id: string) => `/detail/${id}`
}
