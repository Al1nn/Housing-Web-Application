import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
    providedIn: 'root'
})
export class AlertifyService {

    constructor() { }

    success(message: string) {
        if (alertify) {
            alertify.success(message);
        }
    }

    warning(message: string) {
        if (alertify) {
            alertify.warning(message);
        }
    }

    error(message: string) {
        if (alertify) {
            alertify.error(message);
        }
    }

}
