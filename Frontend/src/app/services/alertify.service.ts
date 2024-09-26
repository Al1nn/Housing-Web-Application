import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AlertifyService {

    constructor(private toastr: ToastrService) { }

    success(message: string) {
        this.toastr.success(message, 'Success');
    }

    warning(message: string) {
        this.toastr.warning(message, 'Warning');
    }

    error(message: string) {
        this.toastr.error(message, 'Error');
    }

}
