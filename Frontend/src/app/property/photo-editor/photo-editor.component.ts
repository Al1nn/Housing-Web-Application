import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Property } from '../../model/Property.interface';
import { HousingService } from '../../services/housing.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {


  @Input() property: Property;
  thumbnailsFolder: string = environment.thumbnailFolder;
  maxAllowedFileSize = 10 * 1024 * 1024;

  constructor(private housingService: HousingService) { }

  initializeFileUploader() {

  }

  deletePhoto(propertyId: number, photoFileName: string) {
    this.housingService.deletePhoto(propertyId, photoFileName).subscribe(() => {
      this.housingService.getPropertyPhotos(propertyId).subscribe(data => {
        this.property.photos = data;
      });
    });


  }

  ngOnInit() {

  }

}
