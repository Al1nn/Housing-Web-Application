import { NgModule } from '@angular/core';
import {
    BrowserModule,
    provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {
    HttpClientModule,
    provideHttpClient,
    withFetch,
} from '@angular/common/http';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { AlertifyService } from './services/alertify.service';
import { AuthService } from './services/auth.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { UserProfileResolverService } from './user/user-profile/user-profile-resolver.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
    declarations: [
        AppComponent,
        NavBarComponent,
        UserLoginComponent,
        UserRegisterComponent,
        UserProfileComponent,
        UserSettingsComponent,
    ],
    imports: [
        AppRoutingModule,
        FormsModule,
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch()),
        provideAnimations(),
        AlertifyService,
        AuthService,

        UserProfileResolverService,
        provideAnimationsAsync(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
