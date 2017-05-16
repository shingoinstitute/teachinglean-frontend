import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

import { Globals } from '../globals';

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

  constructor(private userService: UserService) {
    this.baseUrl = Globals.baseApiUrl;
  }

  ngOnInit() {
  }

  onClickLogin() {
    console.log('Username: ' + this.username);
    console.log('Password: ' + this.password);
    this.userService.localLogin(this.username, this.password)
      .subscribe(
        result => {
          console.log(result);
        },
        error => console.error(error)
      );
  }


}
