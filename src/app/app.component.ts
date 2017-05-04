import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MdIconRegistry } from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

import { UserService } from './user/user.service';
import { User } from './user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  user: User;

  constructor(private userService: UserService, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('login', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/login.svg'));
    iconRegistry.addSvgIcon('dashboard', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/view-dashboard.svg'));
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser()
    .subscribe(
      user => this.user = user,
      error => console.error(error)
    );
  }

}
