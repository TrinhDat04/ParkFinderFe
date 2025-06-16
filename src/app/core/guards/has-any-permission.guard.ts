import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RouteData } from '../models/rout-data';
import { TypedActivatedRouteSnapshot } from '../models/typed-activated-route-snapshot';
import { AuthHandlerService } from '../services/auth/auth-hand.service';

@Injectable({
  providedIn: 'root',
})
export class HasAnyPermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private authHandlerService: AuthHandlerService
  ) {}

  canActivate(
    route: TypedActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const routeData = (route.data as RouteData) || {};
    const requiredPermissions = routeData.permissions || [];
    if (requiredPermissions.length > 0) {
      if (!this.authService.isAuthenticated()) {
        this.authHandlerService.handleUnauthorized();
        return false;
      }
      if (
        requiredPermissions.length &&
        !this.authService.hasAnyPermission(requiredPermissions)
      ) {
        this.authHandlerService.handleForbidden();
        return false;
      }
    }
    return true;
  }
}
