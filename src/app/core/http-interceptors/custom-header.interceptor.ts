// This interceptor retries failed HTTP requests a specified number of times before throwing an error. This is useful for handling intermittent network issues.
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CustomHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({
      headers: req.headers.set('X-Custom-Header', 'CustomHeaderValue')
    });
    return next.handle(modifiedReq);
  }
}
