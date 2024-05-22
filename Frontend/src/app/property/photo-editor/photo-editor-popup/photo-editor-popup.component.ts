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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  formData: FormData;
  fileCredentials: any[] = [];
  propertyId: number;
  notifier: boolean;


  closeDialog() {
    this.dialogRef.close(this.notifier);
  }

  uploadPhotos() {
    this.notifier = true;
    this.closeDialog();
  }

  ngOnInit() {
    this.notifier = false;
    this.fileCredentials = this.data.fileCredentials;
  }

}
