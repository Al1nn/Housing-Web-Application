/* eslint-disable max-len */
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { PropertyRoutingModule } from './property-routing.module';
import { PropertyDetailResolverService } from './property-detail-resolver.service';
import { EnsureModuleLoadedOnceGuard } from '../guards/ensure-module-loaded.guard';

@NgModule({
    declarations: [
        PropertyRoutingModule.components
    ],
    imports: [
        PropertyRoutingModule.modules
    ],
    providers: [
        DatePipe,
        AsyncPipe,
        PropertyDetailResolverService,
    ]
})
export class PropertyModule extends EnsureModuleLoadedOnceGuard {
    constructor(@Optional() @SkipSelf() parentModule: PropertyModule) {
        super(parentModule);
    }
}
