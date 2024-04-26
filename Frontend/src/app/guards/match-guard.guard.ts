import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PropertyDetailReaderComponent } from '../property/property-detail/property-detail-reader/property-detail-reader.component';
import { PropertyDetailAdminComponent } from '../property/property-detail/property-detail-admin/property-detail.component';
import { PropertyDetailOwnerComponent } from '../property/property-detail/property-detail-owner/property-detail-owner.component';



let GetRoles = () => {
  const authService = inject(AuthService);
  const token = authService.decodeToken();
  return token?.role;
}

export const matchGuard: CanMatchFn = (route, _segment) => {

  /*
    Cand decodez tokenul, daca are un singur rol => string
                        , daca are mai multe roluri => string[]
                        , daca nu are niciun rol => undefined, inseamna ca nu are cont.
  */
  const decodedRoles: string[] | string | undefined = GetRoles();

  console.log(decodedRoles);

  if (!decodedRoles || decodedRoles.length === 0) { //daca e undefined
    route.component = PropertyDetailReaderComponent;
    return true;
  }

  const rolesArray = Array.isArray(decodedRoles) ? decodedRoles : [decodedRoles]; //daca are un singur rol convertesc in string[]

  const normalizedRoles = rolesArray.map(role => role.toLowerCase()); // "Admin" vs "admin"

  if (normalizedRoles.includes("admin")) {
    route.component = PropertyDetailAdminComponent;
    return true;
  } else if (normalizedRoles.includes("owner")) {
    route.component = PropertyDetailOwnerComponent;
    return true;
  } else if (normalizedRoles.includes("reader")) {
    route.component = PropertyDetailReaderComponent;
    return true;
  }

  route.component = PropertyDetailReaderComponent;
  return true;
};
