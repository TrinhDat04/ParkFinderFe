import { Injectable } from '@angular/core';
import { LocalStorageService } from '../storage/local-storage.service';
import { EnumRole } from '../../constants/roles.enum';
import { EnumPemission } from '../../constants/pemission.enum';
import { LOCAL_STORAGE_KEYS } from '../../constants/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private localStorageService: LocalStorageService) {}

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
}
