import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSidenav } from '@angular/material';

import { UserService } from './services/user.service';
import { User } from './user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sideNav: MdSidenav;
  userDidLogin;
  user: User;

  links = [
    {name: "Home", path: "/"},
    {name: "Q&A Forum", path: "/forum"},
    {name: "Teaching And Curriculum", path: "/teaching"},
    {name: "About Us", path: "/about"}
  ];

  constructor(private userService: UserService,
  iconRegistry: MdIconRegistry,
  sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('login', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/login.svg'));
    iconRegistry.addSvgIcon('dashboard', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/view-dashboard.svg'));
  }

  ngOnInit() {
    this.getUser();
  }

  screenWidthGtSm(): boolean {
    return !(window.innerWidth < 960);
  }

  toggleSidenav() {
    if (window.innerWidth < 960) {
      this.sideNav.toggle();
    } else {
      this.sideNav.open();
    }
  }

  getUser() {
    this.userService.getUser()
    .subscribe(
      (user: User) => {
        this.user = user;
        this.userDidLogin = true;
      },
      () => {
        this.userDidLogin = false;
      }
    );
  }

}
