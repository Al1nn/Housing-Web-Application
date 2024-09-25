/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/indent */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDashboardComponent } from './property-dashboard/property-dashboard.component';
import { PropertyDashboardResolverService } from './property-dashboard/property-dashboard-resolver.service';
import { AddPropertyComponent } from './add-property/add-property.component';
import { PropertyDetailResolverService } from './property-detail-resolver.service';
import { PropertyDetailAdminComponent } from './property-detail-admin/property-detail-admin.component';
import { PropertyContactsComponent } from './property-contacts/property-contacts.component';
import { PropertyContactsResolverService } from './property-contacts/property-contacts-resolver.service';
import { authGuard, contactGuard } from '../guards/auth-guard.guard';
import { PropertyDetailReaderComponent } from './property-detail-reader/property-detail-reader.component';
import { PropertyDetailOwnerComponent } from './property-detail-owner/property-detail-owner.component';
import { matchGuardAdmin, matchGuardOwner } from '../guards/match-guard.guard';
import { PropertyStatsComponent } from './property-stats/property-stats.component';
import { PropertyTreeComponent } from './property-tree/property-tree.component';
import { PropertyDetailEditPopupComponent } from './property-detail-admin/property-detail-edit-popup/property-detail-edit-popup.component';
import { PropertyDetailDeletePopupComponent } from './property-detail-admin/property-detail-delete-popup/property-detail-delete-popup.component';
import { PropertyDetailMapsPopupComponent } from './property-detail-admin/property-detail-edit-popup/property-detail-maps-popup/property-detail-maps-popup.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { PhotoEditorPopupComponent } from './photo-editor/photo-editor-popup/photo-editor-popup.component';
import { HighlightPipe } from '../pipes/highlight.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AngularOpenlayersModule } from 'ng-openlayers';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PropertyDetailPopupMessageComponent } from './property-detail-popup-message/property-detail-popup-message.component';
import { MatDividerModule } from '@angular/material/divider';

const routes: Routes = [
  {
    path: '',
    component: PropertyListComponent,
    data: {
      breadcrumb: 'Buy'
    },
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
export class PropertyRoutingModule {
  static components: any = [PropertyCardComponent,
    PropertyListComponent,
    PropertyDashboardComponent,
    PropertyTreeComponent,
    AddPropertyComponent,
    PhotoEditorComponent,
    PhotoEditorPopupComponent,
    PropertyDetailDeletePopupComponent,
    PropertyDetailEditPopupComponent,
    PropertyDetailMapsPopupComponent,
    PropertyDetailAdminComponent,
    PropertyDetailOwnerComponent,
    PropertyDetailReaderComponent,
    PropertyStatsComponent,
    PropertyContactsComponent,
    PropertyDetailPopupMessageComponent,
    HighlightPipe,]

  static modules: any = [
    CommonModule,
    FormsModule,
    PropertyRoutingModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    AngularOpenlayersModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSelectModule,
    MatSliderModule,
    MatInputModule,
    MatTreeModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgxApexchartsModule,
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    GalleryComponent,
    LoadingBarHttpClientModule,
    LoadingBarModule,
    GoogleMapsModule,
    DragDropModule
  ]
}
