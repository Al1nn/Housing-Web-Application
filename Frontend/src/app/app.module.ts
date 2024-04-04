import { NgModule } from '@angular/core';
import {
    BrowserModule,
    provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PropertyCardElement } from './property/property-card/property-card.component';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {
    HTTP_INTERCEPTORS,
    HttpClientModule,
    provideHttpClient,
    withFetch,
} from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HousingService } from './services/housing.service';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component';
import { PropertyContactsComponent } from './property/property-contacts/property-contacts.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { AlertifyService } from './services/alertify.service';
import { AuthService } from './services/auth.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PropertyDetailResolverService } from './property/property-detail/property-detail-resolver.service';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FilterPipe } from './pipes/filter.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { PriceAreaFilterPipe } from './pipes/price-filter.pipe';
import { HttpErrorInterceptorService } from './services/httperror-interceptor.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PropertyDashboardComponent } from './property/property-dashboard/property-dashboard.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { UserProfileResolverService } from './user/user-profile/user-profile-resolver.service';
import { PhotoEditorComponent } from './property/photo-editor/photo-editor.component';


@NgModule({
    declarations: [
        AppComponent,
        PropertyCardElement,
        PropertyListComponent,
        NavBarComponent,
        AddPropertyComponent,
        PropertyDetailComponent,
        PropertyContactsComponent,
        UserLoginComponent,
        UserRegisterComponent,
        UserProfileComponent,
        UserSettingsComponent,
        FilterPipe,
        SortPipe,
        PriceAreaFilterPipe,
        PropertyDashboardComponent,
        PhotoEditorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ButtonsModule.forRoot(),
        CarouselModule.forRoot(),
        BsDatepickerModule.forRoot(),
        GalleryComponent,
        FileUploadModule,
        ModalModule,
        LoadingBarHttpClientModule,
        LoadingBarModule,
        ImageCropperModule,

    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch()),
        provideAnimations(),
        DatePipe,
        HousingService,
        AlertifyService,
        AuthService,
        PropertyDetailResolverService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptorService,
            multi: true
        },
        UserProfileResolverService,
        BsModalService
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
