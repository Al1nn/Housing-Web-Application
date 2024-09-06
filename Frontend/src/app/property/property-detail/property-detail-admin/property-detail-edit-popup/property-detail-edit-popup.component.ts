import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Property } from '../../../../model/Property.interface';

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IKeyValuePair } from '../../../../model/IKeyValuePair';
import { HousingService } from '../../../../services/housing.service';

// import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-property-detail-edit-popup',
    templateUrl: './property-detail-edit-popup.component.html',
    styleUrls: ['./property-detail-edit-popup.component.css']
})
export class PropertyDetailEditPopupComponent implements OnInit {
    @ViewChild('editFormTabs', { static: false }) formTabs: TabsetComponent;

    property: Property;
    public propertyId: number;
    editPropertyForm: FormGroup;
    propertyTypes: IKeyValuePair[];
    furnishTypes: IKeyValuePair[];
    cityList: any[];

    constructor(
        private fb: FormBuilder
        , private dialogRef: MatDialogRef<PropertyDetailEditPopupComponent>
        , private housingService: HousingService
        , @Inject(MAT_DIALOG_DATA) public data: any) { }

    get BasicInfo() {
        return this.editPropertyForm.controls['BasicInfo'] as FormGroup;
    }
    get sellRent() {
        return this.BasicInfo.controls['sellRent'] as FormControl;
    }

    get bhk() {
        return this.BasicInfo.controls['bhk'] as FormControl;
    }

    get propertyType() {
        return this.BasicInfo.controls['propertyType'] as FormControl;
    }

    get furnishingType() {
        return this.BasicInfo.controls['furnishingType'] as FormControl;
    }

    get name() {
        return this.BasicInfo.controls['name'] as FormControl;
    }

    get city() {
        return this.BasicInfo.controls['city'] as FormControl;
    }

    ngOnInit(): void {
        this.propertyId = this.data.propertyId;
        this.property = this.data.property;
        console.log(typeof (this.property.propertyTypeId));
        this.housingService.getPropertyTypes().subscribe(data => {
            this.propertyTypes = data;
        });

        this.housingService.getFurnishingTypes().subscribe(data => {
            this.furnishTypes = data;
        });

        this.housingService.getAllCities().subscribe((data) => {
            this.cityList = data;
        });

        console.log(this.property);
        this.CreateEditForm();
    }

    closeEditModal() {
        this.dialogRef.close();
    }

    CreateEditForm() {
        this.editPropertyForm = this.fb.group({
            BasicInfo: this.fb.group({
                sellRent: [this.property.sellRent.toString()],
                bhk: [this.property.bhk],
                propertyType: [+this.property.propertyTypeId],
                furnishingType: [+this.property.furnishingTypeId],
                name: [this.property.name, Validators.required],
                city: [this.property.cityId]
            })
        });
    }

    onSubmit() {
        if (this.editPropertyForm.valid) {
            console.log('Form Submitted');
        } else {
            console.log('Form NOT Submitted');
        }
    }

    onCityChange(cityName: string, cityId: number) {
        const cityArray: string[] = cityName.split(',');
        this.property.city = cityArray[0];
        this.property.country = cityArray[1];
        this.property.cityId = cityId;
    }
}
