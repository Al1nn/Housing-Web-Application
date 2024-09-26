import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { UserProfileResolverService } from './user-profile/user-profile-resolver.service';


@NgModule({
    declarations: [
        UserRoutingModule.components
    ],
    imports: [
        UserRoutingModule.modules
    ],
    providers: [
        UserProfileResolverService,
    ]
})
export class UserModule { }
