import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDashboardComponent } from './property-dashboard/property-dashboard.component';
import { PropertyDashboardResolverService } from './property-dashboard/property-dashboard-resolver.service';
import { AddPropertyComponent } from './add-property/add-property.component';
import { PropertyDetailResolverService } from './property-detail/property-detail-resolver.service';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyContactsComponent } from './property-contacts/property-contacts.component';
import { PropertyContactsResolverService } from './property-contacts/property-contacts-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PropertyListComponent,

  },

  {
    path: 'property-dashboard',
    component: PropertyDashboardComponent,
    resolve: {
      property: PropertyDashboardResolverService
    }
  },
  {
    path: 'rent-property',
    component: PropertyListComponent,

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
