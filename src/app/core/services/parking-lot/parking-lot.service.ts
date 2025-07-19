import {Injectable} from '@angular/core';
import {ApiService} from '../network/api.service';
import {AddParkingLotRequest} from '../../models/parking-lot/add-parking-lot-request';
import {Observable} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {
  constructor(private apiService: ApiService) {
  }

  registerParkingLot(request: AddParkingLotRequest): Observable<any>{
    const token = localStorage.getItem('user_token'); // or inject from auth service
    return this.apiService.post<any>({
      serviceUrl: 'default',
      endpoint: '/ParkingLot/registerParkingLot',
      paramsObj: request,
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    })
  }
}
