import { Component, OnInit } from '@angular/core';
import { IUserCard } from '../../model/IUserCard.interface';
import { AuthService } from '../../services/auth.service';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

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

    constructor(private authService: AuthService,
        private housingService: HousingService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.userCard = data['usercard'];
        });

        this.authService.getUserCards().subscribe((data: IUserCard[]) => {
            const decodedToken = this.authService.decodeToken();
            this.userCards = data.filter(card => card.username !== decodedToken?.unique_name);
        });

        this.housingService.getPropertyCountByUser().subscribe((data: number) => {
            this.propertiesListed = data;
        });
    }

}
