import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';

import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { UserProfileResolverService } from './user/user-profile/user-profile-resolver.service';
import { UserSettingsResolverService } from './user/user-settings/user-settings-resolver.service';
const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./property/property.module').then(m => m.PropertyModule),
        data: { breadcrumb: 'Home' }
    },

    { path: 'user/login', component: UserLoginComponent, data: { breadcrumb: null } },
    { path: 'user/register', component: UserRegisterComponent, data: { breadcrumb: null } },
    {
        path: 'user/profile',
        component: UserProfileComponent,
        resolve: { usercard: UserProfileResolverService },
        data: {
            breadcrumb: null
        }
    },
    {
        path: 'user/settings',
        component: UserSettingsComponent,
        resolve: { usercard: UserSettingsResolverService },
        data: {
            breadcrumb: null
        }
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
