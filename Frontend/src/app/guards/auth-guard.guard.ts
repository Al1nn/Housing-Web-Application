
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';

let userExist = (): boolean => {
  return localStorage.getItem('token') ? true : false;
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const alertifyService = inject(AlertifyService);

  if (!userExist()) {
    router.navigate(['user/login']);
    alertifyService.error("You must be logged in to add a property");
    return false;
  }

  return true;
};


export const contactGuard: CanActivateFn = () => {
  const router = inject(Router);
  const alertifyService = inject(AlertifyService);

  if (!userExist()) {
    router.navigate(['/']);
    alertifyService.error("You must be logged in to access property contacts");
    return false;
  }

  return true;
}


