import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE_KEYS } from '../../constants/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AuthHandlerService {
  constructor(private router: Router) {}
  handleUnauthorized() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_TOKEN);
    this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
  }
 
  handleForbidden() {
    this.router.navigate(['/forbidden']);
  }
}
