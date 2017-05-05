import { Component, Input, OnInit, ViewChild, HostListener, AfterViewInit, EventEmitter, Output } from '@angular/core';
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
export class AppComponent implements OnInit {

  user: User = new User();
  @ViewChild('sidenav') sideNav: MdSidenav;
  private sidenavService: SidenavService;
  showDashboard = false;
  showLogin = true;

  constructor(private userService: UserService,
  iconRegistry: MdIconRegistry,
  sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('login', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/login.svg'));
    iconRegistry.addSvgIcon('dashboard', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/view-dashboard.svg'));
  }

  ngOnInit() {
    this.getUser();
    this.sidenavService = new SidenavService(this.sideNav);
  }

  sidenavState(): boolean {
    return this.sidenavService.getState();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 960 && this.sideNav.opened) {
      this.sideNav.close();
    } else if (window.innerWidth >= 961 && !this.sideNav.opened) {
      this.sideNav.open();
    }
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  getUser() {
    this.userService.getUser()
    .subscribe(
      user => {
        this.user = user;
        this.showDashboard = true;
        this.showLogin = false;
      },
      error => {
        this.showDashboard = false;
        this.showLogin = true;
      }
    );
  }

}
