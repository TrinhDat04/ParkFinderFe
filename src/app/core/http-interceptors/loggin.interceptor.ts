// A logging interceptor logs details about each HTTP request and response, which is helpful for debugging or monitoring network requests.
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Outgoing request', req);
    return next.handle(req).pipe(
      tap((value) => {
        console.log('Response received', value);
      })
    );
  }
}
