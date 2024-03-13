import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Property } from '../../model/Property.interface';
import { IPhoto } from '../../model/IPhoto';
import { HousingService } from '../../services/housing.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AlertifyService } from '../../services/alertify.service';



@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() property: Property;
  @Output() mainPhotoChangedEvent = new EventEmitter<string>();

  uploader: FileUploader;
  baseUrl = environment.baseUrl;
  maxAllowedFileSize = 10 * 1024 * 1024;


  constructor(private housingService: HousingService
    , private alertifyService: AlertifyService
    , private router: Router) { }

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
    this.initializeFileUploader();
  }


  setPrimaryPhoto(propertyId: number, photo: IPhoto) {
    if (!localStorage.getItem('username')) {
      this.alertifyService.error("You must be logged in and an admin to modify photos");
      this.router.navigate(['/user/login']);
    }

    this.housingService.setPrimaryPhoto(propertyId, photo.publicId).subscribe(() => {
      this.mainPhotoChanged(photo.imageUrl);
      this.property.photos.forEach(p => {
        if (p.isPrimary) { p.isPrimary = false; }
        if (p.publicId === photo.publicId) { p.isPrimary = true; }
      })
    });
  }

  deletePhoto(propertyId: number, photo: IPhoto) {

    if (!localStorage.getItem('username')) {
      this.alertifyService.error("You must be logged in and an admin to delete photos");
      this.router.navigate(['/user/login']);
    }

    this.housingService.deletePhoto(propertyId, photo.publicId).subscribe(() => {
      this.property.photos = this.property.photos.filter(p => p.publicId !== photo.publicId)
    });
  }
}
