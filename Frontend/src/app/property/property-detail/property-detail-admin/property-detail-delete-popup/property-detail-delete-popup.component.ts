import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HousingService } from '../../../../services/housing.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-property-detail-delete-popup',
    templateUrl: './property-detail-delete-popup.component.html',
    styleUrls: ['./property-detail-delete-popup.component.css']
})
export class PropertyDetailDeletePopupComponent implements OnInit {

    public propertyId: number;

    constructor(
        private dialogRef: MatDialogRef<PropertyDetailDeletePopupComponent>,
        private housingService: HousingService,
        private alertifyService: AlertifyService,
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
        this.housingService.deleteProperty(propertyId).subscribe(() => {
            if (this.data.sellRent === 1) {
                this.router.navigate(['/']);
                this.alertifyService.success('Property Deleted Successfully');
                this.dialogRef.close();
            } else if (this.data.sellRent === 2) {
                this.router.navigate(['/rent-property']);
                this.alertifyService.success('Property Deleted Successfully');
                this.dialogRef.close();
            }
        });
    }
}
