import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-editor-popup',
  templateUrl: './photo-editor-popup.component.html',
  styleUrls: ['./photo-editor-popup.component.css']
})
export class PhotoEditorPopupComponent implements OnInit {



  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  formData: FormData;
  fileCredentials: any[] = [];
  propertyId: number;
  ngOnInit() {
    this.formData = this.data.formData;
    this.fileCredentials = this.data.fileCredentials;
    this.propertyId = this.data.propertyId;
    console.log(this.formData.getAll("files"));
  }

}
