import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from '../../../core/services/network/api.service';
import {ParkingLotWithRating} from '../models/ParkingLotWithRating';
import {REVIEW_ENDPOINTS} from '../../../core/constants/endpoints/review-service-endpoints';

export interface NavigationInfo {
  isNavigating: boolean;
  lotName?: string;
  // lotCode?: string;
  distanceKm?: string;
  pinCoords?: number[];
  userCoords?: number[];
}
@Injectable({ providedIn: 'root' })
export class HomepageService {
  constructor(
    private apService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  private navigationInfo = new BehaviorSubject<NavigationInfo>({
    isNavigating: false,
  });

  public navigationInfo$ = this.navigationInfo.asObservable();

  startNavigation(info: Omit<NavigationInfo, 'isNavigating'>) {
    this.navigationInfo.next({ isNavigating: true, ...info });
  }

  stopNavigation() {
    this.navigationInfo.next({ isNavigating: false });
  }

  getCurrentState(): NavigationInfo {
    return this.navigationInfo.value;
  }
  getTop5RatedParkingLots(): Observable<ParkingLotWithRating[]> {
    return this.apService.get<ParkingLotWithRating[]>({
      serviceUrl: 'default',
      endpoint: REVIEW_ENDPOINTS.getTopRating(3),
    });
  }
}
