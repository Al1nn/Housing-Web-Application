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
import { MatButtonModule } from '@angular/material/button';

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
        AngularFireModule.initializeApp({ "projectId": "your_project_id", "appId": "your_app_id", "databaseURL": "your_firebase_database_url", "storageBucket": "your_storage_bucket", "apiKey": "your_google_api_key", "authDomain": "your_auth_domain", "messagingSenderId": "your_messaging_sender_id" }),
        AngularFireDatabaseModule,
        MatBadgeModule,
        MatIconModule,
        MatButtonModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }),
        BsDropdownModule.forRoot(),

    ], providers: [
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
        provideFirebaseApp(() => initializeApp({ "projectId": "your_project_id", "appId": "your_app_id", "databaseURL": "your_firebase_url", "storageBucket": "your_storage_bucket", "apiKey": "your_google_api_key", "authDomain": "your_auth_domain", "messagingSenderId": "your_messaging_sender_id" })),
        provideDatabase(() => getDatabase()),
    ]
})
export class AppModule { }
