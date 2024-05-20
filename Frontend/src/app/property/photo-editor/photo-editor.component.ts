import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Property } from '../../model/Property.interface';
import { HousingService } from '../../services/housing.service';
import { AlertifyService } from '../../services/alertify.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoEditorPopupComponent } from './photo-editor-popup/photo-editor-popup.component';


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
  formData = new FormData();
  fileCredentials: any[] = [];
  /*
  I need fileCredentials to be something like : 
  {
    text: file.text,
    size: file.size,
    type: file.type
  }
  */
  constructor(private housingService: HousingService, private alertifyService: AlertifyService, private dialogRef: MatDialog) { }

  deletePhoto(propertyId: number, photoFileName: string) {
    this.housingService.deletePhoto(propertyId, photoFileName).subscribe(() => {
      this.housingService.getPropertyPhotos(propertyId).subscribe(data => {
        this.property.photos = data;
      });
    });
  }

  onPhotoAdded(event: any) {
    const files: FileList = event.target.files;

    this.fileCount = files.length;
    if (this.fileCount > 0) {

      for (let i = 0; i < this.fileCount; i++) {
        const file: File = files[i];

        this.formData.append("files", file);
        this.fileCredentials.push({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }


      this.openDialog();
    } else {
      this.fileCount = 0;
      this.alertifyService.error("No file uploaded");
    }
  }



  openDialog() {
    this.dialogRef.open(PhotoEditorPopupComponent, {
      width: '400px',
      height: '700px',
      data: { formData: this.formData, fileCredentials: this.fileCredentials, propertyId: this.property.id }
    });

  }



  ngOnInit() { }
}
