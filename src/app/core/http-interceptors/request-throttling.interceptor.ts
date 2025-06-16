// This interceptor can throttle requests by delaying outgoing requests if too many requests are made in a short time. This is useful to avoid overloading the backend or triggering rate limits.
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ThrottlingInterceptor implements HttpInterceptor {
  private requestDelay = 500; // delay each request by 500 ms

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return timer(this.requestDelay).pipe(
      switchMap(() => next.handle(req))
    );
  }
}
