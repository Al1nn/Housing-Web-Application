import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileResolverService } from './user-profile/user-profile-resolver.service';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserSettingsResolverService } from './user-settings/user-settings-resolver.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserMessagesComponent } from './user-messages/user-messages.component';

const routes: Routes = [
    { path: 'login', component: UserLoginComponent, data: { breadcrumb: null } },
    { path: 'register', component: UserRegisterComponent, data: { breadcrumb: null } },
    {
        path: 'profile',
        component: UserProfileComponent,
        resolve: { usercard: UserProfileResolverService },
        data: {
            breadcrumb: null
        }
    },
    {
        path: 'settings',
        component: UserSettingsComponent,
        resolve: { usercard: UserSettingsResolverService },
        data: {
            breadcrumb: null
        }
    },
    {
        path: 'messages',
        component: UserMessagesComponent,
        data: {
            breadcrumb: null
        }
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
    static components: any = [
        UserLoginComponent,
        UserRegisterComponent,
        UserProfileComponent,
        UserSettingsComponent,
        UserMessagesComponent,
    ]
    static modules: any = [
        CommonModule,
        UserRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        TabsModule.forRoot()
    ]
}
