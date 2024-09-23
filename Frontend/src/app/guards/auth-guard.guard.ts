
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { StoreService } from '../store_services/store.service';

const userExist = (): boolean => {
    return localStorage.getItem('token') ? true : false;
}


export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const store = inject(StoreService);

    if (!userExist()) {
        router.navigate(['user/login']);
        store.alertifyService.error('You must be logged in to add a property');
        return false;
    }

    if (store.authService.isOnlyReader()) {
        store.alertifyService.error('You do not have privilegies');
        return false;
    }

    return true;
};


export const contactGuard: CanActivateFn = () => {
    const router = inject(Router);
    const store = inject(StoreService);

    if (!userExist()) {
        router.navigate(['/']);
        store.alertifyService.error('You must be logged in to access property contacts');
        return false;
    }

    return true;
}




