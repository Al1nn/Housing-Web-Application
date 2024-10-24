import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Property } from '../../models/Property.interface';
import { MatDialog } from '@angular/material/dialog';
import { PhotoEditorPopupComponent } from './photo-editor-popup/photo-editor-popup.component';
import { HttpEventType } from '@angular/common/http';
import { IPhoto } from '../../models/IPhoto.interface';
import { StoreService } from '../../store_services/store.service';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent {
    @Input() property: Property;
    @Output() mainPhotoChangedEvent = new EventEmitter<string>();
    thumbnailsFolder: string = environment.thumbnailFolder;
    fileCount: number;
    uploadProgress = 0;
    photosToUpload: File[] = [];

    constructor(private store: StoreService, private dialogRef: MatDialog) { }

    deletePhoto(propertyId: number, photo: IPhoto) {

        this.store.housingService.deletePhoto(propertyId, photo.fileName).subscribe(() => {
            this.fileCount = 0;
            this.store.housingService.getPropertyPhotos(this.property.id).subscribe(event => {

                if (event.type === HttpEventType.Response) {
                    const photos = event.body;
                    if (photos !== null) {
                        this.property.photos = photos;
                        this.mainPhotoChangedEvent.emit(photos[0].fileName);

                        if (this.property.photo === photo.fileName) {
                            if (photos.length > 0) {

                                this.setMainPhoto(photos[0]);
                            } else {

                                this.mainPhotoChangedEvent.emit('');
                            }
                        }

                    } else {
                        this.property.photos = [];

                        this.mainPhotoChangedEvent.emit('');
                    }
                }
            });

        });

    }

    setMainPhoto(photo: IPhoto) {
        this.property.photo = photo.fileName;
        this.mainPhotoChangedEvent.emit(photo.fileName);
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

            this.store.alertifyService.error('No file uploaded');
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
                this.store.housingService.getPropertyPhotos(this.property.id).subscribe(event => {
                    if (event.type === HttpEventType.DownloadProgress && event.total !== undefined) {
                        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
                    }

                    if (event.type === HttpEventType.Response) {

                        const photos = event.body;

                        this.property.photos = photos as IPhoto[];
                        this.setMainPhoto(this.property.photos[0]);
                    }

                });
            } else if (!result) {
                this.uploadProgress = 0;
                this.fileCount = 0;
            }
        });


    }
}
