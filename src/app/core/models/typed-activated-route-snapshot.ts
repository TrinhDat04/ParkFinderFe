import { ActivatedRouteSnapshot } from '@angular/router';
import { RouteData } from './rout-data';

export interface TypedActivatedRouteSnapshot extends ActivatedRouteSnapshot {
  data: RouteData;
}
