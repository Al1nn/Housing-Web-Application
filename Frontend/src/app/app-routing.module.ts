import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { PropertyListComponent } from './property/property-list/property-list.component';

import { PropertyDetailComponent } from './property/property-detail/property-detail.component';
import { PropertyContactsComponent } from './property/property-contacts/property-contacts.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { PropertyDetailResolverService } from './property/property-detail/property-detail-resolver.service';
import { PropertyListResolverService } from './property/property-list/property-list-resolver.service';
import { PropertyListRentResolverService } from './property/property-list/property-list-rent-resolver.service';
import { PropertyDashboardComponent } from './property/property-dashboard/property-dashboard.component';
import { PropertyContactsResolverService } from './property/property-contacts/property-contacts-resolver.service';
const routes: Routes = [
    {
        path: '',
        component: PropertyListComponent,
        resolve: {
            propertySell: PropertyListResolverService,
        }
    },
    { path: 'property-dashboard', component: PropertyDashboardComponent },
    {
        path: 'rent-property',
        component: PropertyListComponent,
        resolve: {
            propertyRent: PropertyListRentResolverService,
        }
    },
    { path: 'add-property', component: AddPropertyComponent },
    {
        path: 'property-detail/:id',
        component: PropertyDetailComponent,
        resolve: { property: PropertyDetailResolverService },
    },
    {
        path: 'property-contacts/:id',
        component: PropertyContactsComponent,
        resolve: { property: PropertyContactsResolverService },
    },
    { path: 'user/login', component: UserLoginComponent },
    { path: 'user/register', component: UserRegisterComponent },
    { path: '**', component: PropertyListComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
