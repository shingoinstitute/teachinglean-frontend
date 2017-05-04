import { Component, Input, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSidenav } from '@angular/material';

import { UserService } from './user/user.service';
import { User } from './user/user';
import { SidenavService } from './sidenav/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {

  user: User = new User();
  @ViewChild('sidenav') sideNav: MdSidenav;
  private sidenavService: SidenavService;
  showDashboard = false;
  showLogin = false;

  constructor(private userService: UserService,
  iconRegistry: MdIconRegistry,
  sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('login', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/login.svg'));
    iconRegistry.addSvgIcon('dashboard', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/view-dashboard.svg'));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.sidenavService.setState();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  openSidenav() {
    this.sidenavService.open();
  }

  ngAfterViewInit() {
    this.sidenavService = new SidenavService(this.sideNav);
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser()
    .subscribe(
      user => {
        this.user = user;
        this.showDashboard = true;
      },
      error => {
        console.error(error);
        this.showLogin = true;
      }
    );
  }

}
