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
  console.log(rolesArray);
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

// export const matchGuard: CanMatchFn = (route) => {

//   /*
//     Cand decodez tokenul, daca are un singur rol => string
//                         , daca are mai multe roluri => string[]
//                         , daca nu are niciun rol => undefined, inseamna ca nu are cont.
//   */
//   const decodedRoles: string[] | string | undefined = GetRoles();

//   console.log(decodedRoles);


//   if (!decodedRoles || decodedRoles.length === 0) { //daca e undefined
//     return false;
//   }

//   const rolesArray = Array.isArray(decodedRoles) ? decodedRoles : [decodedRoles]; //daca are un singur rol convertesc in string[]

//   const normalizedRoles = rolesArray.map(role => role.toLowerCase()); // "Admin" vs "admin"

//   if (normalizedRoles.includes("admin")) {
//     route.component = PropertyDetailAdminComponent;
//     return true;
//   } else if (normalizedRoles.includes("owner")) {
//     route.component = PropertyDetailOwnerComponent;
//     return true;
//   } else if (normalizedRoles.includes("reader")) {
//     return false;
//   }


//   return false;
// };
