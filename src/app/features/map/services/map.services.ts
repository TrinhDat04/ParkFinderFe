import { Injectable } from "@angular/core";
import { MAP_ENDPOINTS } from "../../../core/constants/endpoints/map-endpoints";
import { ApiService } from "../../../core/services/network/api.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ParkingLot} from '../models/parking-lot';


@Injectable({
    providedIn: 'root',
})
export class MapService {
    constructor(private apService : ApiService) {}
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
