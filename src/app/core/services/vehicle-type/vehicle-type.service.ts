import {Injectable} from '@angular/core';
import {ApiService} from '../network/api.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService{
  constructor(private apiService: ApiService) {
  }

  getVehicleTypes(){
    return this.apiService.get<any>({
      serviceUrl: 'default',
      endpoint: '/vehicleType',
    })
  }
}
