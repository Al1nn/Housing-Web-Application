/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { PropertyRoutingModule } from './property-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HousingService } from '../services/housing.service';
import { PropertyDetailResolverService } from './property-detail/property-detail-resolver.service';
import { HttpErrorInterceptorService } from '../services/httperror-interceptor.service';

@NgModule({
    declarations: [
        PropertyRoutingModule.components
    ],
    imports: [
        PropertyRoutingModule.modules
    ],
    providers: [
        BsModalService,
        HousingService,
        DatePipe,
        AsyncPipe,
        PropertyDetailResolverService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptorService,
            multi: true
        },
    ]
})
export class PropertyModule { }
