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

  fileCredentials: any[] = [];
  formData: FormData;


  closeDialog() {
    this.dialogRef.close();
  }

  uploadPhotos() {
    console.log(this.formData.getAll("files"));
    //Aici fac call-ul pentru API . Si tot aici trimit fiecare descriere din acel textbox

    this.formData.delete("files");
    this.closeDialog();
  }

  ngOnInit() {
    this.fileCredentials = this.data.fileCredentials;
    this.formData = this.data.formData;
  }

}
