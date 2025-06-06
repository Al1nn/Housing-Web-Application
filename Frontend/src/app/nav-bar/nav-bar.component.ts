import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { StoreService } from '../store_services/store.service';
import { INotification } from '../models/INotification.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent implements OnInit {



    loggedIn: boolean = false;
    loggedInUser: string | undefined;
    profilePicture: string | undefined;
    thumbnailFolder: string = environment.thumbnailFolder;
    originalFolder: string = environment.originalPictureFolder;




    matBadger: number = 0;
    newNotifications: INotification[];

    private subscription: Subscription = new Subscription();

    constructor(
        public store: StoreService,
        private router: Router,
        private cdr : ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.subscription.add(this.store.loggedIn$.subscribe(loggedIn => {
            this.loggedIn = loggedIn;
            if (this.loggedIn) {
                this.checkUserDetails();

            } else {
                this.loggedInUser = undefined;
                this.profilePicture = undefined;
            }
        }));


        
        this.checkForLoggedIn();
    }



    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private checkForLoggedIn(): void {
        const token = this.store.authService.decodeToken();
        this.store.setLoggedIn(token !== null);
    }

    private checkUserDetails(): void {
        const token = this.store.authService.decodeToken();
        if (token) {
            this.loggedInUser = token.unique_name;
            this.profilePicture = token.profile_picture;

            this.subscription.add(
                this.store.chatService.listenNotifications(token.nameid).subscribe(notifications => {
                    this.matBadger = notifications.length;
                    this.newNotifications = notifications;
                    this.cdr.detectChanges();
                })
            );
            
        }
    }

    // private listenToNotifications() : void {

    // }

    isOnlyReader(): boolean {
        return this.store.authService.isOnlyReader();
    }

    isAdmin(): boolean {
        return this.store.authService.isAdmin();
    }

    onLogout() {
        localStorage.removeItem('token');
        this.store.alertifyService.success('You are logged out!');
        this.store.setLoggedIn(false);
        this.router.navigate(['/']);
    }

    // async deleteNotification(index: number) {
    //     try {
    //         const token = this.store.authService.decodeToken();
    //         if (token) {
    //             await this.store.chatService.deleteNotificationAtIndex(token.nameid, index);
    //             // The notification list will automatically update through the existing subscription
    //             this.cdr.detectChanges();
    //         }
    //     } catch (error) {
    //         console.error('Error deleting notification:', error);
    //         this.store.alertifyService.error('Failed to delete notification');
    //     }
    // }
}