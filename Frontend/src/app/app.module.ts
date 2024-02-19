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
        FilterPipe,
        SortPipe,
        PriceAreaFilterPipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ButtonsModule.forRoot(),
        CarouselModule.forRoot(),
        BsDatepickerModule.forRoot(),
        GalleryComponent,
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch()),
        provideAnimations(),
        HousingService,
        AlertifyService,
        AuthService,
        PropertyDetailResolverService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
