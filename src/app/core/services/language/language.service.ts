import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../storage/local-storage.service';
import { LOCAL_STORAGE_KEYS } from '../../constants/local-storage-key';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LANGUAGE_TYPE } from '../../constants/language-type';
import { EnumLanguageModule } from '../../constants/language-module.enum';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang?: string;
  private currentModules: EnumLanguageModule[] = [];
  private loadedGlobalLanguages = new Set<string>();
  private loadedModuleLanguages = new Map<EnumLanguageModule, Set<string>>();
  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private http: HttpClient
  ) { }

  getLanguages(): { value: string; label: string }[] {
    return Object.entries(LANGUAGE_TYPE).map(([key, value]) => ({
      value: key,
      label: value,
    }));
  }
  getLanguagesObservable(): Observable<{ value: string; label: string }[]> {
    const languages = Object.entries(LANGUAGE_TYPE).map(([key, value]) => ({
      value: key,
      label: value,
    }));
    return of(languages);
  }

  setDefaultLanguage() {
    var curentLanguage = this.localStorageService.getItem(
      LOCAL_STORAGE_KEYS.CURRENT_LANGUAGE
    );
    this.currentLang = this.currentLang || curentLanguage;
    this.currentLang = this.currentLang || LANGUAGE_TYPE.EN;
    this.changeLanguage(this.currentLang);
  }

  changeLanguage(lang: string) {
    let observer = [];
    if (!this.loadedGlobalLanguages.has(lang)) {
      observer.push(this.loadGlobalTranslations(lang));
    }
    const modules = this.currentModules.filter((module) => {
      return !this.loadedModuleLanguages.get(module)?.has(lang);
    });
    if (modules.length > 0) {
      observer.push(this.loadModuleTranslations(modules, lang));
    }
    if (observer.length > 0) {
      forkJoin(observer).subscribe(() => {
        this.translateService.use(lang);
        this.localStorageService.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_LANGUAGE,
          lang
        );
      });
    } else {
      this.translateService.use(lang);
      this.localStorageService.setItem(
        LOCAL_STORAGE_KEYS.CURRENT_LANGUAGE,
        lang
      );
    }
  }

  getCurrentLanguage(): string {
    var lang = this.translateService.currentLang || this.currentLang;
    lang = lang || LANGUAGE_TYPE.EN;
    return lang;
  }

  loadGlobalTranslations(lang?: string): Observable<any> {
    var curentLanguage = this.localStorageService.getItem(
      LOCAL_STORAGE_KEYS.CURRENT_LANGUAGE
    );
    lang = lang || this.currentLang;
    lang = lang || curentLanguage;
    lang = lang || LANGUAGE_TYPE.EN;
    return this.http.get(`./assets/i18n/global/combined/${lang}.json`).pipe(
      tap((mergedTranslations) => {
        this.translateService.setTranslation(lang, mergedTranslations, true);
        if (!this.loadedGlobalLanguages.has(lang)) {
          this.loadedGlobalLanguages.add(lang);
        }
      })
    );
  }

  loadModuleTranslations(
    modules?: EnumLanguageModule[],
    lang?: string
  ): Observable<any> {
    modules = modules || this.currentModules;
    if (modules == null) {
      return of(null);
    }
    var curentLanguage = this.localStorageService.getItem(
      LOCAL_STORAGE_KEYS.CURRENT_LANGUAGE
    );
    lang = lang || this.currentLang;
    lang = lang || curentLanguage;
    lang = lang || LANGUAGE_TYPE.EN;
    const prepareModules = modules.filter((module) => {
      return !this.loadedModuleLanguages.get(module)?.has(lang);
    });
    if (prepareModules.length === 0) {
      return of(null);
    }
    const moduleRequests = prepareModules.map((module) =>
      this.http
        .get(`./assets/i18n/module/${module}/combined/${lang}.json`)
        .pipe(
          tap((mergedTranslations) => {
            this.translateService.setTranslation(
              lang,
              mergedTranslations,
              true
            );
            if (!this.loadedModuleLanguages.has(module)) {
              this.loadedModuleLanguages.set(module, new Set());
            }
            if (!this.loadedModuleLanguages.get(module)?.has(lang)) {
              this.loadedModuleLanguages.get(module)?.add(lang);
            }
            this.currentModules.concat(module);
          })
        )
    );
    return forkJoin(moduleRequests);
  }
}
