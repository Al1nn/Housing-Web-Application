import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PropertyCardElement } from './property/property-card/property-card.component';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http'
import { HousingService } from './services/housing.service';
import { AddPropertyComponent } from './property/add-property/add-property.component';

@NgModule({
  declarations: [
    AppComponent,
    PropertyCardElement,
    PropertyListComponent,
    NavBarComponent,
    AddPropertyComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    HousingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
