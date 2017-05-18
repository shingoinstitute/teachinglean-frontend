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
      .subscribe(
        result => { this.onClickLoginComplete(result); },
        error => console.error(error),
        () => { this.spinnerEnabled = false; }
      );
  }

  onClickLoginComplete(result) {
    this.userService.user = User.initFromObject(result);
    this.router.navigate(['/dashboard']);
  }

}
