import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { HousingService } from '../../../services/housing.service';
import { Property } from '../../../model/Property.interface';





@Component({
  selector: 'app-photo-editor-popup',
  templateUrl: './photo-editor-popup.component.html',
  styleUrls: ['./photo-editor-popup.component.css']
})
export class PhotoEditorPopupComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<PhotoEditorPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private housingService: HousingService
  ) { }

  photosToUpload: File[] = [];
  notifier: boolean;
  fileControl = new FormControl();
  property: Property;
  uploadProgress: number;
  descriptions: string[] = [];

  formatFileSize(size: number): string {
    if (size < 1024) {
      return size + ' bytes';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }

  closeDialog() {

    this.dialogRef.close(this.notifier);
  }

  uploadPhotos() {
    this.notifier = true;

    const uploadTasks = this.photosToUpload.map((file, index) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", this.descriptions.at(index) as string);
      return this.housingService.addPropertyPhoto(this.property.id, formData).toPromise();
    });

    Promise.all(uploadTasks).then(() => {
      this.closeDialog();
    }).catch((error) => {
      this.notifier = false;
      console.log(error);
      this.closeDialog();
    });
  }

  ngOnInit() {
    this.notifier = false;
    this.property = this.data.property;
    this.photosToUpload = this.data.photosToUpload;
    this.descriptions = new Array(this.photosToUpload.length).fill('');
  }

}
