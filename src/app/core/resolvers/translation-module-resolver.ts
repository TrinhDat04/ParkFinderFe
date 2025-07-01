import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { LanguageService } from '../services/language/language.service';
import { Observable } from 'rxjs';
import { TypedActivatedRouteSnapshot } from '../models/typed-activated-route-snapshot';

@Injectable({
  providedIn: 'root',
})
export class TranslationModuleResolver implements Resolve<any> {
  constructor(private languageService: LanguageService) {}
  resolve(
    route: TypedActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.languageService.loadModuleTranslations(
      route.data.LanguageModules
    );
  }
}
