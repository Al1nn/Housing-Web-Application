import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { HousingService } from '../services/housing.service';
import { AlertifyService } from '../services/alertify.service';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { UserProfileResolverService } from './user-profile/user-profile-resolver.service';


@NgModule({
    declarations: [
        UserRoutingModule.components
    ],
    imports: [
        UserRoutingModule.modules
    ],
    providers: [
        HousingService,
        AlertifyService,
        BreadcrumbService,
        UserProfileResolverService
    ]
})
export class UserModule { }
