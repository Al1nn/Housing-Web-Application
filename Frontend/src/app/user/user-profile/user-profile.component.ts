import { Component, OnInit } from '@angular/core';
import { IUserCard } from '../../model/IUserCard.interface';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StoreService } from '../../store_services/store.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


    public userCard: IUserCard;
    public userCards: IUserCard[];
    public propertiesListed: number;

    public originalFolder: string = environment.originalPictureFolder;
    public thumbnailFolder: string = environment.thumbnailFolder;

    constructor(
        private store: StoreService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.userCard = data['usercard'];
        });

        this.store.usersService.getUserCards().subscribe((data: IUserCard[]) => {
            const decodedToken = this.store.authService.decodeToken();
            this.userCards = data.filter(card => card.username !== decodedToken?.unique_name);
        });

        this.store.housingService.getPropertyCountByUser().subscribe((data: number) => {
            this.propertiesListed = data;
        });
    }

}
