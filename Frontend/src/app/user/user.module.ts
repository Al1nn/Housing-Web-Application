import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { HousingService } from '../services/housing.service';
import { AlertifyService } from '../services/alertify.service';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileResolverService } from './user-profile/user-profile-resolver.service';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
    declarations: [
        UserLoginComponent,
        UserRegisterComponent,
        UserProfileComponent,
        UserSettingsComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        TabsModule.forRoot()
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch()),
        provideAnimations(),
        HousingService,
        AlertifyService,
        BreadcrumbService,
        UserProfileResolverService,
        provideAnimationsAsync()
    ]
})
export class UserModule { }
