import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MAP_ENDPOINTS } from '../../../core/constants/endpoints/map-endpoints';

@Injectable({ providedIn: 'root' })
export class MapDataService {
  constructor(private http: HttpClient) {}

  getGeoJson(): Observable<any> {
    return this.http.get<any>(`${MAP_ENDPOINTS.getMapDataJSON}`);
  }
}
