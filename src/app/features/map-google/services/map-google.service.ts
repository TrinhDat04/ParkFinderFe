import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { MAP_ENDPOINTS } from '../../../core/constants/endpoints/map-endpoints';
import {ParkingLot} from '../../map/models/parking-lot';
import {ApiService} from '../../../core/services/network/api.service';

@Injectable({ providedIn: 'root' })
export class MapDataService {
  constructor(private http: HttpClient,
              private apService: ApiService) { }

  getGeoJson(): Observable<any> {
    return this.http.get<any>(`${MAP_ENDPOINTS.getMapDataJSON}`);
  }
  getParkingLotDetail(id: string): Observable<ParkingLot> {
    return this.apService.get<ParkingLot>({
      serviceUrl: 'default',
      endpoint: MAP_ENDPOINTS.getParkingLotDetail(id),
    });
  }
  private hideNavbarSubject = new BehaviorSubject<boolean>(false);
  hideNavbar$ = this.hideNavbarSubject.asObservable();

  setNavbarHidden(hidden: boolean) {
    this.hideNavbarSubject.next(hidden);
  }
  private detailVisibleSubject = new BehaviorSubject<boolean>(false);
  detailVisible$ = this.detailVisibleSubject.asObservable();

  setDetailVisible(value: boolean) {
    this.detailVisibleSubject.next(value);
  }
}
