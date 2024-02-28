import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Property } from '../../model/Property.interface';
import { IPhoto } from '../../model/IPhoto';
import { HousingService } from '../../services/housing.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() property: Property;
  @Output() mainPhotoChangedEvent = new EventEmitter<string>();
  constructor(private housingService: HousingService) { }

  mainPhotoChanged(url: string) {
    this.mainPhotoChangedEvent.emit(url);
  }

  ngOnInit() {
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
