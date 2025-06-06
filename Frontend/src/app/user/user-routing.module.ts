import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileResolverService } from './user-profile/user-profile-resolver.service';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserMessagesComponent } from './user-messages/user-messages.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserSettingsDeleteModalComponent } from './user-settings/user-settings-delete-modal/user-settings-delete-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes: Routes = [
    { path: 'login', component: UserLoginComponent, data: { breadcrumb: null } },
    { path: 'register', component: UserRegisterComponent, data: { breadcrumb: null } },
    {
        path: 'profile',
        component: UserProfileComponent,
        resolve: { usercards: UserProfileResolverService },
        data: {
            breadcrumb: null
        }
    },
    {
        path: 'settings',
        component: UserSettingsComponent,
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
        UserSettingsDeleteModalComponent,
    ]
    static modules: any = [
        CommonModule,
        UserRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatDialogModule,
        FormsModule,
        MatListModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        TabsModule.forRoot()
    ]
}
