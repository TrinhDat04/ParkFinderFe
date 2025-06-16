import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { USER_ENDPOINTS } from '../../../core/constants/endpoints/user-service-endpoints';
import { ApiService } from '../../../core/services/network/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apService: ApiService) {}

  getUserById(id: string | number): Observable<User> {
    return this.apService.get<User>({ endpoint: USER_ENDPOINTS.getById(id) });
  }
}
