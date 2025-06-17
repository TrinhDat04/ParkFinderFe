import {Injectable} from '@angular/core';
import {LocalStorageService} from '../storage/local-storage.service';
import {EnumRole} from '../../constants/roles.enum';
import {EnumPemission} from '../../constants/pemission.enum';
import {LOCAL_STORAGE_KEYS} from '../../constants/local-storage-key';
import {ApiService} from '../network/api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private localStorageService: LocalStorageService, private apiService: ApiService) {
  }

  isAuthenticated(): boolean {
    // return this.localStorageService.getItem(LOCAL_STORAGE_KEYS.USER_TOKEN) ? true : false;
    return true;
  }

  hasAnyRoles(requireAnyRoles: EnumRole[]): boolean {
    return true;
  }

  hasAnyPermission(requiredPermissions: EnumPemission[]): boolean {
    return true;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post<any>({
      serviceUrl: "auth",
      endpoint: "/login",
      paramsObj: credentials
    });
  }

  register(userData: {
    email: string;
    password: string,
    fullName: string,
    phoneNumber: string | null,
    role: string
  }): Observable<any> {
    console.log('Sending registration request:', userData);
    return this.apiService.post<any>({
      serviceUrl: "auth",
      endpoint: "/register",
      paramsObj: userData
    });
  }
}
