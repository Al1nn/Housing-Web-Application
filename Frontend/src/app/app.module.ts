import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, withFetch, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';
import { HttpErrorInterceptorService } from './services/httperror-interceptor.service';
import { StoreService } from './store_services/store.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    declarations: [
        AppComponent,
        BreadcrumbComponent,
        NavBarComponent
    ],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }),
        BsDropdownModule.forRoot()], providers: [
            provideClientHydration(),
            provideHttpClient(withFetch()),
            provideAnimationsAsync(),
            StoreService,
            {
                provide: HTTP_INTERCEPTORS,
                useClass: HttpErrorInterceptorService,
                multi: true
            },
            provideHttpClient(withInterceptorsFromDi())
        ]
})
export class AppModule { }
