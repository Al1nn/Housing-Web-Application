import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileResolverService } from './user-profile/user-profile-resolver.service';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserSettingsResolverService } from './user-settings/user-settings-resolver.service';

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
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
