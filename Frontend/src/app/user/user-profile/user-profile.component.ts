import { Component, OnInit } from '@angular/core';
import { IUserCard } from '../../model/IUserCard.interface';
import { AuthService } from '../../services/auth.service';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


  public userCard: IUserCard;
  hasImage: string;
  public userCards: IUserCard[];
  public propertiesListed: number;
  constructor(private authService: AuthService,
    private housingService: HousingService
    , private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.userCard = data['usercard'];
      this.hasImage = data['usercard'].url;
    });

    this.authService.getUserCards().subscribe((data: IUserCard[]) => {
      this.userCards = data;
    });

    this.housingService.getPropertyCountByUser().subscribe((data: number) => {
      this.propertiesListed = data;
    });
  }

}
