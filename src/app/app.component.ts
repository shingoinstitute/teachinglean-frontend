import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSidenav } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { UserService } from './services/user.service';
import { User } from './user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sideNav: MdSidenav;
  
  userDidLogin: boolean;
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
    iconRegistry.addSvgIcon('accountCircle', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/account-circle.svg'));
    iconRegistry.addSvgIcon('logout', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/logout.svg'));
    iconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/menu.svg'));
  }

  ngOnInit() {

    this.userService.userLoginDetected$.subscribe(
      user => {
        this.user = user;
        this.announceLogin(user !== null || user !== undefined);
      }
    )

    this.userDidLogin = false;
    this.getUser();
  }

  announceLogin(isLoggedIn: boolean) {
    this.userService.announceLogin(isLoggedIn);
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

  onDidGetUser(user: User) {
    this.user = user;
    this.userDidLogin = true;
  }

  getUser() {
    this.userService.getUser()
    .subscribe(
      this.onDidGetUser,
      this.onHandleError
    );
  }

  private onHandleError(error) {
    console.log(error);
  }

}
