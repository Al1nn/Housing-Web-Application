import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Property } from '../../model/Property.interface';
import { IPhoto } from '../../model/IPhoto';
import { HousingService } from '../../services/housing.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() property: Property;
  @Input() fromAddProperty: boolean;
  @Output() mainPhotoChangedEvent = new EventEmitter<string>();

  uploader: FileUploader;
  baseUrl = environment.baseUrl;
  maxAllowedFileSize = 10 * 1024 * 1024;


  constructor(private housingService: HousingService) { }

  mainPhotoChanged(url: string) {
    this.mainPhotoChangedEvent.emit(url);
  }
  initializeFileUploader() {
    this.uploader = new FileUploader(
      {
        url: this.baseUrl + '/property/add/photo/' + this.property.id,
        authToken: 'Bearer ' + localStorage.getItem('token'),
        isHTML5: true,
        allowedFileType: ['image'],
        removeAfterUpload: true,
        autoUpload: true,
        maxFileSize: this.maxAllowedFileSize
      }
    );

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (_item, response, _status, _headers) => {
      if (response) {
        const photo = JSON.parse(response);
        console.log(photo);
        this.property.photos.push(photo);
      }
    }
  }

  initializeAddFileUploader() {


  }

  ngOnInit() {
    if (!this.fromAddProperty) {
      this.initializeFileUploader();
    } else {
      this.initializeAddFileUploader();
    }

  }


  setPrimaryPhoto(propertyId: number, photo: IPhoto) {
    this.housingService.setPrimaryPhoto(propertyId, photo.publicId).subscribe(() => {
      this.mainPhotoChanged(photo.imageUrl);
      this.property.photos.forEach(p => {
        if (p.isPrimary) { p.isPrimary = false; }
        if (p.publicId === photo.publicId) { p.isPrimary = true; }
      })
    });
  }

  deletePhoto(propertyId: number, photo: IPhoto) {
    this.housingService.deletePhoto(propertyId, photo.publicId).subscribe(() => {
      this.property.photos = this.property.photos.filter(p => p.publicId !== photo.publicId)
    });
  }
}
