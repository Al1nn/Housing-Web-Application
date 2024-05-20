import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HousingService } from '../../../services/housing.service';
import { AlertifyService } from '../../../services/alertify.service';

@Component({
  selector: 'app-photo-editor-popup',
  templateUrl: './photo-editor-popup.component.html',
  styleUrls: ['./photo-editor-popup.component.css']
})
export class PhotoEditorPopupComponent implements OnInit {



  constructor(
    public dialogRef: MatDialogRef<PhotoEditorPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    , private housingService: HousingService
    , private alertifyService: AlertifyService) { }

  formData: FormData;
  fileCredentials: any[] = [];
  propertyId: number;



  closeDialog() {
    this.dialogRef.close();
  }

  uploadPhotos() {
    this.housingService.addPropertyPhotos(this.propertyId, this.formData).subscribe(() => { //Reorganize these API calls with switchMap or IDK,
      this.housingService.getPropertyPhotos(this.propertyId).subscribe((data) => {
        this.data.property.photos = data;
      });


    });
    this.formData.delete("files");
    this.alertifyService.success("Photos uploaded successfully");
    this.closeDialog();
  }

  ngOnInit() {
    this.formData = this.data.formData;
    this.fileCredentials = this.data.fileCredentials;
    this.propertyId = this.data.property.id;
  }

}
