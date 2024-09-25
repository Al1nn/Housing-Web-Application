import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';
import { ErrorCode } from '../enums/enums';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {
    private alertifyService = inject(AlertifyService);

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log('HTTP Request started');
        return next.handle(request).pipe(
            retry({
                count: 3,
                delay: (error, retryCount) => this.retryStrategy(error, retryCount)
            }),
            catchError((error: HttpErrorResponse) => {
                const errorMessage = this.setError(error);
                console.error('HTTP Error:', error);
                this.alertifyService.error(errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    private retryStrategy(error: HttpErrorResponse, retryCount: number): Observable<number> {
        if (retryCount >= 3) {
            return throwError(() => error);
        }

        const retryDelay = 1000 * Math.pow(2, retryCount);

        switch (error.status) {
            case ErrorCode.serverDown:
            case ErrorCode.unauthorised:
                return throwError(() => error);
            default:
                console.log(`Attempt ${retryCount + 1}: retrying in ${retryDelay}ms`);
                return timer(retryDelay);
        }
    }

    private setError(error: HttpErrorResponse): string {
        if (error.error && typeof error.error === 'object' && 'message' in error.error) {
            // Client-side error or server error with message property
            return error.error.message;
        }

        if (error.status === 0) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }

        if (error.status === ErrorCode.unauthorised) {
            return error.error?.errorMessage || 'Unauthorized access';
        }

        if (typeof error.error === 'string') {
            return error.error;
        }

        return error.message || 'An unknown error occurred';
    }
}
