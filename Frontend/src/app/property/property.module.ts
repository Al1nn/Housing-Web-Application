import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PropertyRoutingModule } from './property-routing.module';
import { PropertyCardElement } from './property-card/property-card.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDashboardComponent } from './property-dashboard/property-dashboard.component';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { PropertyDetailAdminComponent } from './property-detail/property-detail-admin/property-detail.component';
import { PropertyContactsComponent } from './property-contacts/property-contacts.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';
import { SortPipe } from '../pipes/sort.pipe';
import { PriceAreaFilterPipe } from '../pipes/price-filter.pipe';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HousingService } from '../services/housing.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PropertyDetailResolverService } from './property-detail/property-detail-resolver.service';
import { HttpErrorInterceptorService } from '../services/httperror-interceptor.service';
import { PropertyDetailOwnerComponent } from './property-detail/property-detail-owner/property-detail-owner.component';
import { PropertyDetailReaderComponent } from './property-detail/property-detail-reader/property-detail-reader.component';



@NgModule({
  declarations: [
    PropertyCardElement,
    PropertyListComponent,
    PropertyDashboardComponent,
    AddPropertyComponent,
    PhotoEditorComponent,
    PropertyDetailAdminComponent,
    PropertyDetailOwnerComponent,
    PropertyDetailReaderComponent,
    PropertyContactsComponent,
    FilterPipe,
    SortPipe,
    PriceAreaFilterPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PropertyRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    GalleryComponent,
    ModalModule,
    LoadingBarHttpClientModule,
    LoadingBarModule,
    ImageCropperModule,
  ],
  providers: [
    BsModalService,
    HousingService,
    DatePipe,
    PropertyDetailResolverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
  ]
})
export class PropertyModule { }
