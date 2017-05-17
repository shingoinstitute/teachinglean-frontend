import {Component, EventEmitter, OnInit, Output} from '@angular/core';

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

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  onClickSignup() {
    if (this.password === this.confirmPassword) {
      this.userService.signUp(this.user, this.password)
        .subscribe(
          result => {
            console.log(result);
          },
          error => console.error(error)
        );
    }
  }

  onClickLogin() {
    this.onClickLoginHandler.emit(true)
  }

}
