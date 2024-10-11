import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StoreService } from '../../../store_services/store.service';


@Component({
    selector: 'app-property-detail-delete-popup',
    templateUrl: './property-detail-delete-popup.component.html',
    styleUrls: ['./property-detail-delete-popup.component.css']
})
export class PropertyDetailDeletePopupComponent implements OnInit {

    public propertyId: number;

    constructor(
        private dialogRef: MatDialogRef<PropertyDetailDeletePopupComponent>,
        private store: StoreService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        this.propertyId = this.data.propertyId;

        console.log(this.data.sellRent);
    }

    closeDeleteModal() {
        this.dialogRef.close();
    }

    deleteProperty(propertyId: number) {
        this.store.housingService.deleteProperty(propertyId).subscribe(() => {
            if (this.data.sellRent === 1) {
                this.router.navigate(['/']);
                this.store.alertifyService.success('Property Deleted Successfully');
                this.dialogRef.close();
            } else if (this.data.sellRent === 2) {
                this.router.navigate(['/rent-property']);
                this.store.alertifyService.success('Property Deleted Successfully');
                this.dialogRef.close();
            }
        });
    }
}
