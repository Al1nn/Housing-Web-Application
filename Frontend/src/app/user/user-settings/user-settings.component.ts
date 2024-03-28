import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserCard } from '../../model/IUserCard.interface';
import { HousingService } from '../../services/housing.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  userCard: IUserCard;
  propertiesListed: number;
  hasImage: string;
  imageChangedEvent: Event;
  modalRef: BsModalRef;


  constructor(private route: ActivatedRoute
    , private housingService: HousingService
    , private modalService: BsModalService
    , private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.userCard = data['usercard'];
      this.hasImage = data['usercard'].url;
      console.log(this.userCard);
    });

    this.housingService.getPropertyCountByUser().subscribe((data) => {
      this.propertiesListed = data;
    })
  }

  onFileChange(event: Event) {
    this.imageChangedEvent = event;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  submitProfilePicture() {
    console.log("Picture submitted");
    this.modalRef.hide();
    this.cdr.detectChanges();
  }

  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }

  loadImageFailed() {
    //failed
  }
  cropperReady() {
    //ready
  }
  imageLoaded() {
    //loaded
  }
  imageCropped(event: ImageCroppedEvent) {
    this.userCard.url = event.base64 as string;
  }
}
