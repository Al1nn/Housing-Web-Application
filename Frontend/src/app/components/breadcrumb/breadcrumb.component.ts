/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

    breadcrumbs$: Observable<Array<{ label: string, url: string }>>;
    showBreadcrumb: boolean = true;
    constructor(private breadcrumbService: BreadcrumbService) { }

    ngOnInit() {
        this.breadcrumbs$ = this.breadcrumbService.getBreadcrumbs();
        this.breadcrumbs$.subscribe(breadcrumbs => {
            this.showBreadcrumb = breadcrumbs.every(breadcrumb => breadcrumb.label !== null);
        });
    }

}
