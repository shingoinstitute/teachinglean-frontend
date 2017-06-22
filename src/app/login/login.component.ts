import { Component, HostListener } from '@angular/core';
import { UserService } from '../services/user.service';

import { Globals } from '../globals';
import { User } from '../user/user';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  spinnerEnabled = false;
  showCreateAccount = false;
  loginError: string;
  username = '';
  password = '';
  baseUrl;

  constructor(private userService: UserService, private router: Router) {
    this.baseUrl = Globals.baseApiUrl;
  }

  @HostListener('window:keyup.enter', ['$event'])
  keyupHandler(ev: KeyboardEvent) {
    if (this.username.length > 0 && this.password.length > 0) {
      this.onClickLogin();
    }
  }

  onClickLogin() {
    this.spinnerEnabled = true;
    this.userService.localLogin(this.username, this.password)
    .subscribe((data) => {
      this.router.navigate(['/dashboard']);
    }, (error) => {
      this.spinnerEnabled = false;
      let errMsg;
      if (error instanceof String) {
        errMsg = error;
      } else if (error.message) {
        errMsg = error.message;
      } else if (error.toString) {
        errMsg = error.toString();
      }
      console.error(errMsg);
      this.loginError = errMsg; 
    });
  }

  authenticateLinkedin(e) {
    this.userService.authenticateLinkedin();
  }

}
