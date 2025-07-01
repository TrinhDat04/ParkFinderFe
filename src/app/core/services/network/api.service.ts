import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from '../../../../environments/environment';
import { RequestOptions } from './request-options';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(option: RequestOptions): Observable<T> {
    const httpParams = this.buildHttpParams(option.paramsObj);
    return this.http.get<T>(
      `${ENVIRONMENT.serviceUrl[option.serviceUrl || 'default']}${
        option.endpoint
      }`,
      {
        params: httpParams,
        headers: option.headers
      }
    );
  }

  post<T>(option: RequestOptions): Observable<T> {
    return this.http.post<T>(
      `${ENVIRONMENT.serviceUrl[option.serviceUrl || 'default']}${
        option.endpoint
      }`,
      option.paramsObj,
      option.headers ? { headers: option.headers } : {}
    );
  }

  put<T>(option: RequestOptions): Observable<T> {
    return this.http.put<T>(
      `${ENVIRONMENT.serviceUrl[option.serviceUrl || 'default']}${
        option.endpoint
      }`,
      option.paramsObj
    );
  }

  delete<T>(option: RequestOptions): Observable<T> {
    const httpParams = this.buildHttpParams(option.paramsObj);
    return this.http.delete<T>(
      `${ENVIRONMENT.serviceUrl[option.serviceUrl || 'default']}${
        option.endpoint
      }`,
      {
        params: httpParams,
      }
    );
  }

  private buildHttpParams(paramsObj?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (paramsObj) {
      Object.keys(paramsObj).forEach((key) => {
        const value = paramsObj[key];
        if (value !== undefined) {
          httpParams = httpParams.set(key, value);
        }
      });
    }
    return httpParams;
  }
}
