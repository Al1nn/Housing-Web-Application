import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {



  constructor(private alertifyService : AlertifyService
    , private authService : AuthService
    , private router : Router) { }

  onLogin(loginForm : NgForm) {
   console.log(loginForm.value);
   const token = this.authService.authUser(loginForm.value);
   if(token){
      localStorage.setItem('token', token.userName);
      this.alertifyService.success("Login Successful");
      this.router.navigate(['/']);
   }else{
      this.alertifyService.error("User id or password is wrong");
   }
  }

  ngOnInit() {
  }

}
