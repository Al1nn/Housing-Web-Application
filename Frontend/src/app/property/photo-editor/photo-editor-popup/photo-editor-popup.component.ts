import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

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

  photosToUpload: File[] = [];
  notifier: boolean;
  fileControl = new FormControl();

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
    console.log(this.photosToUpload);
    this.closeDialog();
  }

  ngOnInit() {
    this.notifier = false;
    this.photosToUpload = this.data.photosToUpload;
  }

}
