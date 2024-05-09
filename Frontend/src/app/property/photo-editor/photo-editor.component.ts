import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Property } from '../../model/Property.interface';
import { HousingService } from '../../services/housing.service';
import { AlertifyService } from '../../services/alertify.service';


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

  constructor(private housingService: HousingService
    , private alertifyService: AlertifyService
  ) { }


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
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        formData.append("files", file);
      }

      this.housingService.addPropertyPhotos(this.property.id, formData).subscribe(() => {

        this.housingService.getPropertyPhotos(this.property.id).subscribe(data => {
          this.property.photos = data;
        });
        this.alertifyService.success("Photos added successfully");
        this.fileCount = 0;

      });

    } else {
      this.fileCount = 0;
      this.alertifyService.error("No file uploaded");
    }

  }





  ngOnInit() {

  }

}
