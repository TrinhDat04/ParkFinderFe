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
    // const token = localStorage.getItem("user_token") ?? '';
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('user_token') ?? '';
    }
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5b3VyX3N1YmplY3RfaGVyZSIsImp0aSI6IjgyNWYxZWU5LTgxZDYtNGNmMS05YzcwLTM0NDA0ZmRhYTExZCIsIklkIjoiMTExMTExMTEtMTExMS0xMTExLTExMTEtMTExMTExMTExMTExIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTc1MDE2NzA0NSwiZXhwIjoxNzUwMjI3MDQ1LCJpYXQiOjE3NTAxNjcwNDUsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9obS1lc2hvcC01YmQwMSIsImF1ZCI6ImhtLWVzaG9wLTViZDAxIn0.80FVV57DqUvAzJc4A2xNpN5RfYu9Dfu_8Y7W-QZdmyk';
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
