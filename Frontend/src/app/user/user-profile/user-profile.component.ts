import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StoreService } from '../../store_services/store.service';
import { IUserCard } from '../../models/IUserCard.interface';
import { IToken } from '../../models/IToken.interface';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    public userCards: IUserCard[];
    public propertiesListed: number;

    public originalFolder: string = environment.originalPictureFolder;
    public thumbnailFolder: string = environment.thumbnailFolder;

    public userCard: IToken;
    constructor(
        private store: StoreService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.userCards = data['usercards'];
            this.userCard = this.store.authService.decodeToken() as IToken;
        });

        this.store.housingService.getPropertyCountByUser().subscribe((data: number) => {
            this.propertiesListed = data;
        });
    }

    isOnlyReader(): boolean {
        return this.store.authService.isOnlyReader();
    }

}
