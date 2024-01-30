import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IPropertyBase } from '../../model/IPropertyBase.interface';
import { Property } from '../../model/Property.interface';
import { HousingService } from '../../services/housing.service';
import { AlertifyService } from '../../services/alertify.service';
@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css'],
})
export class AddPropertyComponent implements OnInit {
  addPropertyForm: FormGroup;

  @ViewChild('formTabs', { static: false }) formTabs: TabsetComponent;

  nextClicked: boolean;
  contactAdded: boolean = false;
  property = new Property();

  //This later will come from the database
  propertyTypes: Array<string> = ['House', 'Apartment', 'Duplex'];
  furnishTypes: Array<string> = ['Fully', 'Semi', 'Unfurnished'];
  cityList: string[];

  propertyView: IPropertyBase = {
    Id: 0,
    Name: '',
    Price: null,
    SellRent: null,
    PType: null,
    FType: null,
    BHK: null,
    City: '',
    BuiltArea: null,
    CarpetArea: null,
    RTM: null,
    Image: 'house_default',
  };

  constructor(
    private alertifyService: AlertifyService,
    private housingService: HousingService,
    private fb: FormBuilder,
    private route: Router
  ) {}

  ngOnInit() {
    this.CreateAddPropertyForm();
    this.housingService.getAllCities().subscribe((data) => {
      this.cityList = data;
      console.log(data);
    });
  }

  CreateAddPropertyForm() {
    this.addPropertyForm = this.fb.group({
      BasicInfo: this.fb.group({
        SellRent: ['1', Validators.required],
        BHK: [null, Validators.required],
        PType: [null, Validators.required],
        FType: [null, Validators.required],
        Name: [null, Validators.required],
        City: [null, Validators.required],
      }),
      PriceInfo: this.fb.group({
        Price: [null, Validators.required],
        BuiltArea: [null, Validators.required],
        CarpetArea: [null],
        Security: [null],
        Maintenance: [null],
      }),
      AddressInfo: this.fb.group({
        FloorNo: [null],
        TotalFloor: [null],
        Contacts: this.fb.array([], Validators.required),
        LandMark: [null],
      }),

      OtherInfo: this.fb.group({
        RTM: [null, Validators.required],
        PossessionOn: [null],
        AOP: [null],
        Gated: [null],
        MainEntrance: [null],
        Description: [null],
      }),
    });
  }

  onBack() {
    this.route.navigate(['/']);
  }

  onSubmit() {
    this.nextClicked = true;
    if (this.allTabsValid()) {
      console.log('Congrats, your property listed succesfully on our website');
      console.log(this.addPropertyForm);
      this.mapProperty();
      this.housingService.addProperty(this.property);
      this.alertifyService.success(
        'Congrats, your property listed successfully on our website'
      );

      if (this.SellRent.value === '2') {
        this.route.navigate(['/rent-property']);
      } else {
        this.route.navigate(['/']);
      }

      console.log(
        'Successfully stored property contacts:',
        this.property.Contacts
      );
    } else {
      console.log('Please review the form and add all entries');
      this.alertifyService.error(
        'Please review the form and provide all valid entries'
      );
    }
  }

  mapProperty(): void {
    this.property.Id = this.housingService.newPropID();
    this.property.SellRent = +this.SellRent.value;
    this.property.BHK = this.BHK.value;
    this.property.PType = this.PType.value;
    this.property.Name = this.Name.value;
    this.property.City = this.City.value;
    this.property.FType = this.FType.value;
    this.property.Price = this.Price.value;
    this.property.Security = this.Security.value;
    this.property.Maintenance = this.Maintenance.value;
    this.property.BuiltArea = this.BuiltArea.value;
    this.property.CarpetArea = this.CarpetArea.value;
    this.property.FloorNo = this.FloorNo.value;
    this.property.TotalFloor = this.TotalFloor.value;
    this.property.Contacts = (this.Contacts as FormArray).controls.map(
      (contactControl: AbstractControl) => {
        const address = (contactControl as FormGroup).get('Address')?.value;
        const phone = (contactControl as FormGroup).get('Phone')?.value;

        // Return a contact object
        return { Address: address, Phone: phone };
      }
    );

    this.property.RTM = Number(this.RTM.value);
    this.property.AOP = Number(this.AOP.value);
    this.property.Gated = Number(this.Gated.value);
    this.property.MainEntrance = this.MainEntrance.value;
    this.property.Possession = this.PossessionOn.value;
    this.property.Description = this.Description.value;
    this.property.PostedOn = new Date().toString();
  }

  allTabsValid(): boolean {
    if (this.BasicInfo.invalid) {
      this.formTabs.tabs[0].active = true;
      return false;
    }

    if (this.PriceInfo.invalid) {
      this.formTabs.tabs[1].active = true;
      return false;
    }

    if (this.AddressInfo.invalid) {
      this.formTabs.tabs[2].active = true;
      return false;
    }

    if (this.OtherInfo.invalid) {
      this.formTabs.tabs[3].active = true;
      return false;
    }
    return true;
  }

  selectTab(tabId: number, isCurrentTabValid: boolean) {
    this.nextClicked = true;
    if (isCurrentTabValid) {
      this.formTabs.tabs[tabId].active = true;
    }
  }

  addContact() {
    const newContact = this.fb.group({
      Address: [null, Validators.required],
      Phone: [null, Validators.required],
    });
    this.Contacts.push(newContact);
  }

  removeContact(index: number) {
    this.Contacts.removeAt(index);
  }

  //#region <Getter Methods>
  // #region <FormGroups>
  get BasicInfo() {
    return this.addPropertyForm.controls['BasicInfo'] as FormGroup;
  }

  get PriceInfo() {
    return this.addPropertyForm.controls['PriceInfo'] as FormGroup;
  }

  get AddressInfo() {
    return this.addPropertyForm.controls['AddressInfo'] as FormGroup;
  }

  get OtherInfo() {
    return this.addPropertyForm.controls['OtherInfo'] as FormGroup;
  }

  // #endregion

  //#region <Form Controls>
  get SellRent() {
    return this.BasicInfo.controls['SellRent'] as FormControl;
  }

  get BHK() {
    return this.BasicInfo.controls['BHK'] as FormControl;
  }

  get PType() {
    return this.BasicInfo.controls['PType'] as FormControl;
  }

  get FType() {
    return this.BasicInfo.controls['FType'] as FormControl;
  }

  get Name() {
    return this.BasicInfo.controls['Name'] as FormControl;
  }

  get City() {
    return this.BasicInfo.controls['City'] as FormControl;
  }

  get Price() {
    return this.PriceInfo.controls['Price'] as FormControl;
  }

  get BuiltArea() {
    return this.PriceInfo.controls['BuiltArea'] as FormControl;
  }

  get CarpetArea() {
    return this.PriceInfo.controls['CarpetArea'] as FormControl;
  }

  get Security() {
    return this.PriceInfo.controls['Security'] as FormControl;
  }

  get Maintenance() {
    return this.PriceInfo.controls['Maintenance'] as FormControl;
  }

  get FloorNo() {
    return this.AddressInfo.controls['FloorNo'] as FormControl;
  }

  get TotalFloor() {
    return this.AddressInfo.controls['TotalFloor'] as FormControl;
  }

  get Contacts() {
    return this.AddressInfo.controls['Contacts'] as FormArray;
  }

  getContactAddress(index: number) {
    return this.Contacts.at(index).get('Address') as FormControl;
  }

  getContactPhone(index: number) {
    return this.Contacts.at(index).get('Phone') as FormControl;
  }

  get LandMark() {
    return this.AddressInfo.controls['LandMark'] as FormControl;
  }

  get RTM() {
    return this.OtherInfo.controls['RTM'] as FormControl;
  }

  get PossessionOn() {
    return this.OtherInfo.controls['PossessionOn'] as FormControl;
  }

  get AOP() {
    return this.OtherInfo.controls['AOP'] as FormControl;
  }

  get Gated() {
    return this.OtherInfo.controls['Gated'] as FormControl;
  }

  get MainEntrance() {
    return this.OtherInfo.controls['MainEntrance'] as FormControl;
  }

  get Description() {
    return this.OtherInfo.controls['Description'] as FormControl;
  }

  //#endregion
  //#endregion
}
