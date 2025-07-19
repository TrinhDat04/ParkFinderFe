import {Injectable} from '@angular/core';
import {ApiService} from '../network/api.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  constructor(private apiService: ApiService) {
  }

  getFeatures(){
    return this.apiService.get<any>({
      serviceUrl: 'default',
      endpoint: '/feature',
    })
  }
}
