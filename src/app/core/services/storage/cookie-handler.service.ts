import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieHandlerService {

  constructor(private cookieService: CookieService) { }

  setCookie(name: string, value: string, expiresDays: number): void {
    this.cookieService.set(name, value, expiresDays);
  }

  getCookie(name: string): string {
    return this.cookieService.get(name);
  }

  deleteCookie(name: string): void {
    this.cookieService.delete(name);
  }

  checkCookie(name: string): boolean {
    return this.cookieService.check(name);
  }
}
