import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

import { User } from '../user/user';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  @Output() onClickLoginHandler = new EventEmitter<any>();

  private user: User = new User();
  private createButonEnabled = true;
  private password = "";
  private confirmPassword = "";
  errorMsg: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  onClickSignup() {
    if (this.password === this.confirmPassword) {
      let user = {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email
      }
      this.userService.create(user, this.password)
        .subscribe(
          result => {
            this.router.navigate(['dashboard']);
          },
          error => {
            console.error(error);
            this.errorMsg = error.message ? error.message : error;
          }
        );
    }
  }

  onClickLogin() {
    this.onClickLoginHandler.emit(true)
  }

}
