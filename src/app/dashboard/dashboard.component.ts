import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import {UserService} from "../services/user.service";
import {User} from "../user/user";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {

  spinnerEnabled = true;

  subscription: Subscription;

  user: User;

  constructor(private userService: UserService, private router: Router) {
    this.subscription = userService.userLoginAnnounce$.subscribe(
      userDoesExist => { this.handleUserLoginAnnounce(userDoesExist); }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleUserLoginAnnounce(userDoesExist: boolean) {
    this.spinnerEnabled = false;
    if (!userDoesExist) {
      this.router.navigate(['login']);
    } else {
      this.user = this.userService.user;
    }
  }

}
