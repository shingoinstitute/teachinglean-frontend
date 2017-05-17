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
    this.userService.localLogin(this.username, this.password)
      .subscribe(
        result => {

          let user = new User();
          user.initFromObject(result);

          this.userService.setUser(user);

          this.router.navigate(['/dashboard']);

        },
        error => console.error(error)
      );
  }


}
