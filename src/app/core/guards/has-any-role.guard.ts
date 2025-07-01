import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { TypedActivatedRouteSnapshot } from '../models/typed-activated-route-snapshot';
import { AuthHandlerService } from '../services/auth/auth-hand.service';

@Injectable({
  providedIn: 'root',
})
export class HasAnyRoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private authHandlerService: AuthHandlerService
  ) {}
  canActivate(route: TypedActivatedRouteSnapshot): boolean {
    var data = route.data || {};
    const roles = data.roles || [];
    if (roles.length > 0) {
      if (this.authService.isAuthenticated()) {
        if (this.authService.hasAnyRoles(roles)) {
          return true;
        }
        this.authHandlerService.handleUnauthorized();
        return false;
      }
      this.authHandlerService.handleUnauthorized();
      return false;
    }
    return true;
  }
}
