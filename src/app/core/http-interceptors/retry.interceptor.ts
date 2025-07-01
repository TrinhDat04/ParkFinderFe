// This interceptor retries failed HTTP requests a specified number of times before throwing an error. This is useful for handling intermittent network issues.
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(3), // Retries the request up to 3 times
      catchError((error: HttpErrorResponse) => {
        console.error('Request failed after 3 retries');
        return throwError(error);
      })
    );
  }
}
