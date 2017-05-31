import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

import { Globals } from '../globals';
import { User } from '../user/user';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  spinnerEnabled = false;
  showCreateAccount = false;
  loginError: string;
  username = '';
  password = '';
  baseUrl;

  constructor(private userService: UserService, private router: Router) {
    this.baseUrl = Globals.baseApiUrl;
  }

  ngOnInit() {
  }

  onClickLogin() {
    this.spinnerEnabled = true;
    this.userService.localLogin(this.username, this.password)
    .subscribe((data) => {
      this.router.navigate(['/dashboard']);
    }, (error) => {
      this.spinnerEnabled = false;
      console.error(error);
      this.loginError = error; 
    });
  }

}
