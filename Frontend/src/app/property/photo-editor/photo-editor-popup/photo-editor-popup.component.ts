import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-editor-popup',
  templateUrl: './photo-editor-popup.component.html',
  styleUrls: ['./photo-editor-popup.component.css']
})
export class PhotoEditorPopupComponent implements OnInit {



  constructor(
    public dialogRef: MatDialogRef<PhotoEditorPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  formData: FormData;
  fileCredentials: any[] = [];
  propertyId: number;



  closeDialog() {
    this.dialogRef.close();
  }

  uploadPhotos() {
    this.closeDialog();
  }

  ngOnInit() {
    this.formData = this.data.formData;
    this.fileCredentials = this.data.fileCredentials;
    this.propertyId = this.data.propertyId;
    console.log(this.formData.getAll("files"));
  }

}
