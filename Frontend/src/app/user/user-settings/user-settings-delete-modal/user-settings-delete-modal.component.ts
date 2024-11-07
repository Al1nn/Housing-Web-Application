import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StoreService } from '../../../store_services/store.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-settings-delete-modal',
    templateUrl: './user-settings-delete-modal.component.html',
    styleUrls: ['./user-settings-delete-modal.component.css']
})
export class UserSettingsDeleteModalComponent implements OnInit {



    constructor(private dialogRef: MatDialogRef<UserSettingsDeleteModalComponent>
        , private store: StoreService
        , private router: Router
    ) { }

    ngOnInit() {
    }

    deleteAccount() {
        this.store.usersService.deleteAccount().subscribe(() => {
            if (localStorage) {
                localStorage.removeItem('token');
                this.store.setLoggedIn(false);
            }
            this.store.alertifyService.success("Account Deleted");
            this.router.navigate(['/']);
            this.dialogRef.close();
        });
    }
    closeDeleteModal() {
        this.dialogRef.close();
    }

}
