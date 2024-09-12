import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        AppComponent,
        BreadcrumbComponent,
        NavBarComponent
    ],
    imports: [
        AppRoutingModule,
        CommonModule,
        BrowserModule,
        HttpClientModule,
        BsDropdownModule.forRoot()
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch()),
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
