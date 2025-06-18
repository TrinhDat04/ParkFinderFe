import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/network/api.service';
import { User } from '../models/user';
import { USER_ENDPOINTS } from '../../../core/constants/endpoints/user-service-endpoints';
import {UpdateProfilePresenter} from '../models/update-profile-presenter';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private apService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUserById(id: string | number): Observable<User> {
    return this.apService.get<User>({ endpoint: USER_ENDPOINTS.getById(id) });
  }

  getUserProfile(userId: string): Observable<User> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('user_token') ?? '';
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'userId': userId // nếu backend vẫn yêu cầu
    });
    return this.apService.get<User>({
      serviceUrl: 'user',
      endpoint: USER_ENDPOINTS.getUser,
      headers: headers,
    });
  }
  editProfile(presenter: UpdateProfilePresenter): Observable<any> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('user_token') ?? '';
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.apService.post({
      serviceUrl: 'user',
      endpoint: USER_ENDPOINTS.updateProfile,
      paramsObj: presenter,
      headers: headers
    });
  }
}
