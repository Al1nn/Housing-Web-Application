import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { AlertifyService } from "./alertify.service";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {

    /**
     *
     */
    constructor(private alertifyService: AlertifyService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log("HTTP Request started");
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    const errorMessage = this.setError(error);
                    console.log(error);
                    this.alertifyService.error(errorMessage);
                    return throwError(errorMessage);
                })
            );
    }

    setError(error: HttpErrorResponse): string {
        let errorMessage = 'Unknown error occured';
        if (error.error.errorMessage instanceof ErrorEvent) {
            //Client side error
            errorMessage = error.message;
        } else {
            if (error.status !== 0) {
                errorMessage = error.error.errorMessage;
            }
        }
        return errorMessage;
    }
}