/* eslint-disable @typescript-eslint/indent */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDashboardComponent } from './property-dashboard/property-dashboard.component';
import { PropertyDashboardResolverService } from './property-dashboard/property-dashboard-resolver.service';
import { AddPropertyComponent } from './add-property/add-property.component';
import { PropertyDetailResolverService } from './property-detail/property-detail-resolver.service';
import { PropertyDetailAdminComponent } from './property-detail/property-detail-admin/property-detail.component';
import { PropertyContactsComponent } from './property-contacts/property-contacts.component';
import { PropertyContactsResolverService } from './property-contacts/property-contacts-resolver.service';
import { authGuard, contactGuard } from '../guards/auth-guard.guard';
import { PropertyDetailReaderComponent } from './property-detail/property-detail-reader/property-detail-reader.component';
import { PropertyDetailOwnerComponent } from './property-detail/property-detail-owner/property-detail-owner.component';
import { matchGuardAdmin, matchGuardOwner } from '../guards/match-guard.guard';
import { PropertyStatsComponent } from './property-stats/property-stats.component';
import { PropertyTreeComponent } from './property-tree/property-tree.component';


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
    },
    data: {
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: 'property-stats',
    component: PropertyStatsComponent,
    canMatch: [matchGuardAdmin],
    data: {
      breadcrumb: 'Stats'
    }
  },
  {
    path: 'property-tree',
    component: PropertyTreeComponent,
    data: {
      breadcrumb: 'Tree'
    },
  },
  {
    path: 'rent-property',
    component: PropertyListComponent,
    data: {
      breadcrumb: 'Rent'
    }
  },
  {
    path: 'add-property', component: AddPropertyComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Add'
    }
  },
  {
    path: 'property-detail/:id',
    component: PropertyDetailAdminComponent,
    resolve: { property: PropertyDetailResolverService },
    canMatch: [matchGuardAdmin],
    data: {
      breadcrumb: 'Details'
    }
  },
  {
    path: 'property-detail/:id',
    component: PropertyDetailOwnerComponent,
    resolve: { property: PropertyDetailResolverService },
    canMatch: [matchGuardOwner],
    data: {
      breadcrumb: 'Details'
    }
  },
  {
    path: 'property-detail/:id',
    component: PropertyDetailReaderComponent,
    resolve: { property: PropertyDetailResolverService },
    data: {
      breadcrumb: 'Details'
    }
  },
  {
    path: 'property-contacts/:id',
    component: PropertyContactsComponent,
    resolve: { property: PropertyContactsResolverService },
    canActivate: [contactGuard],
    data: {
      breadcrumb: 'Contacts'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
