// This interceptor measures the time taken to complete each HTTP request and logs it. This can help identify slow API calls or performance bottlenecks.
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const start = Date.now();
    return next.handle(req).pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
      })
    );
  }
}
