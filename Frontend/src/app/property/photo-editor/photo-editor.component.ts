import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Property } from '../../model/Property.interface';
import { HousingService } from '../../services/housing.service';
import { AlertifyService } from '../../services/alertify.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoEditorPopupComponent } from './photo-editor-popup/photo-editor-popup.component';
import { HttpEventType } from '@angular/common/http';
import { IPhoto } from '../../model/IPhoto';




@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() property: Property;
  thumbnailsFolder: string = environment.thumbnailFolder;
  fileCount: number;
  uploadProgress: number = 0;
  photosToUpload: File[] = [];
  @Output() mainPhotoChangedEvent = new EventEmitter<string>();
  @Output() photosUpdated = new EventEmitter<IPhoto[]>();



  constructor(private housingService: HousingService, private alertifyService: AlertifyService, private dialogRef: MatDialog) { }


  deletePhoto(propertyId: number, photo: IPhoto) {

    this.housingService.deletePhoto(propertyId, photo.fileName).subscribe(() => {
      this.fileCount = 0;
      this.housingService.getPropertyPhotos(this.property.id).subscribe(event => {

        if (event.type === HttpEventType.Response) {
          const photos = event.body;
          if (photos !== null) {
            this.property.photos = photos;
            this.mainPhotoChangedEvent.emit(photos[0].fileName);

            if (this.property.photo === photo.fileName) {
              if (photos.length > 0) {

                this.setMainPhoto(photos[0]);
              } else {

                this.mainPhotoChangedEvent.emit("");
              }
            }

          } else {
            this.property.photos = [];
            this.photosUpdated.emit([]);
            this.mainPhotoChangedEvent.emit("");
          }
        }
      });

    });

  }

  setMainPhoto(photo: IPhoto) {
    this.property.photo = photo.fileName; // Assuming mainPhotoUrl is a property in the Property interface
    this.mainPhotoChangedEvent.emit(photo.fileName); // Emit the new main photo change event
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
      this.uploadProgress = 0;
      this.openDialog();
    } else {

      this.fileCount = 0;
      this.uploadProgress = 0;

      this.alertifyService.error("No file uploaded");
    }
  }

  openDialog() {

    const dialogRef = this.dialogRef.open(PhotoEditorPopupComponent, {
      width: '400px',
      height: '700px',
      data: {
        photosToUpload: this.photosToUpload,
        property: this.property,
        uploadProgress: this.uploadProgress,

      }
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.housingService.getPropertyPhotos(this.property.id).subscribe(event => {
          console.log(event.type);
          if (event.type === HttpEventType.DownloadProgress && event.total !== undefined) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          }

          if (event.type === HttpEventType.Response) {

            const photos = event.body;

            this.property.photos = photos as IPhoto[];
            this.mainPhotoChangedEvent.emit(this.property.photos[0].fileName);
          }

        });
      } else if (!result) {
        this.uploadProgress = 0;
        this.fileCount = 0;
      }
    });


  }



  ngOnInit() { }
}
