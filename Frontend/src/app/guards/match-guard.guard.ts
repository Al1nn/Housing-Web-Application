import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

let GetRoles = () => {
  const authService = inject(AuthService);
  const token = authService.decodeToken();
  return token?.role;
}

export const matchGuardAdmin: CanMatchFn = () => {
  const decodedRoles: string[] | string | undefined = GetRoles();

  if (!decodedRoles || decodedRoles.length === 0) {
    return false;
  }

  const rolesArray = Array.isArray(decodedRoles) ? decodedRoles : [decodedRoles];
  const normalizedRoles = rolesArray.map(role => role.toLowerCase());

  if (normalizedRoles.includes("admin")) {
    return true;
  }

  return false;
}

export const matchGuardOwner: CanMatchFn = () => {
  const decodedRoles: string[] | string | undefined = GetRoles();

  if (!decodedRoles || decodedRoles.length === 0) {
    return false;
  }

  const rolesArray = Array.isArray(decodedRoles) ? decodedRoles : [decodedRoles];
  const normalizedRoles = rolesArray.map(role => role.toLowerCase());

  if (normalizedRoles.includes("owner")) {
    return true;
  }

  return false;
}


