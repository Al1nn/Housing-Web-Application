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
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    declarations: [
        AppComponent,
        BreadcrumbComponent,
        NavBarComponent
    ],
    bootstrap: [AppComponent],
    imports: [AppRoutingModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp({ "projectId": "myfirstapp-a15e1", "appId": "1:859208953616:web:f9a1026cb308c49963bf95", "databaseURL": "https://myfirstapp-a15e1-default-rtdb.europe-west1.firebasedatabase.app", "storageBucket": "myfirstapp-a15e1.appspot.com", "apiKey": "AIzaSyAN3_n0tOjV_tJ37vc33Xpa9Kbr5ERSRGE", "authDomain": "myfirstapp-a15e1.firebaseapp.com", "messagingSenderId": "859208953616" }),
        AngularFireDatabaseModule,
        MatBadgeModule,
        MatIconModule,
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
            provideHttpClient(withInterceptorsFromDi()),
            provideFirebaseApp(() => initializeApp({ "projectId": "myfirstapp-a15e1", "appId": "1:859208953616:web:f9a1026cb308c49963bf95", "databaseURL": "https://myfirstapp-a15e1-default-rtdb.europe-west1.firebasedatabase.app", "storageBucket": "myfirstapp-a15e1.appspot.com", "apiKey": "AIzaSyAN3_n0tOjV_tJ37vc33Xpa9Kbr5ERSRGE", "authDomain": "myfirstapp-a15e1.firebaseapp.com", "messagingSenderId": "859208953616" })),
            provideDatabase(() => getDatabase())
        ]
})
export class AppModule { }
