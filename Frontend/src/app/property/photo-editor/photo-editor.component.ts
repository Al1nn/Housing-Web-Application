import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Property } from '../../model/Property.interface';
import { HousingService } from '../../services/housing.service';
import { AlertifyService } from '../../services/alertify.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoEditorPopupComponent } from './photo-editor-popup/photo-editor-popup.component';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() property: Property;
  thumbnailsFolder: string = environment.thumbnailFolder;
  maxAllowedFileSize = 10 * 1024 * 1024;
  fileCount: number;
  uploadProgress: number = 0;
  photosToUpload: File[] = [];

  constructor(private housingService: HousingService, private alertifyService: AlertifyService, private dialogRef: MatDialog) { }


  deletePhoto(propertyId: number, photoFileName: string) {
    this.housingService.deletePhoto(propertyId, photoFileName).subscribe(() => {

      this.housingService.getPropertyPhotos(this.property.id).subscribe(event => {

        if (event.type === HttpEventType.UploadProgress && event.total) { //Responsabil pentru sincronizarea Progress Barului, nu prinde HttpEventType.UploadProgress
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }

        if (event.type === HttpEventType.Response) { //Prinde HttpEventType.Response
          const photos = event.body;
          if (photos !== null) {
            this.property.photos = photos;
          } else {
            this.property.photos = [];
          }
        }
      });

    });

  }

  onPhotoAdded(event: any) {
    const files: FileList = event.target.files;
    this.fileCount = files.length;
    this.photosToUpload = [];
    if (this.fileCount > 0) {
      for (let i = 0; i < this.fileCount; i++) {
        const file: File = files[i];
        this.photosToUpload.push(file);
      }
      // Open the dialog only if files are uploaded
      this.openDialog();
    } else {
      // If no files are selected, reset file count and do not open the dialog
      this.fileCount = 0;
      // Check if the input element still has files selected
      // const fileInputElement: HTMLInputElement = event.target;
      // if (!fileInputElement.value) {
      //   console.log("Event file dialog closed without selecting files");
      // }
      this.alertifyService.error("No file uploaded");
    }
  }

  openDialog() {

    const dialogRef = this.dialogRef.open(PhotoEditorPopupComponent, {
      width: '400px',
      height: '700px',
      data: {
        photosToUpload: this.photosToUpload,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Getter of the uploaded files");
      } else {
        this.fileCount = 0;
      }
    })

  }

  ngOnInit() { }
}
