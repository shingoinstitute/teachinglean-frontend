import {
  Component, 
  EventEmitter, 
  OnInit, 
  Output, 
  ViewChild, 
  HostListener
} from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSidenav } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { UserService } from './services/user.service';
import { SidenavService } from './services/sidenav.service';
import { User } from './user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sideNav: MdSidenav;

  links = [
    {name: "Home", path: "/"},
    {name: "Q&A Forum", path: "/forum"},
    {name: "Teaching And Curriculum", path: "/teaching"},
    {name: "About Us", path: "/about"}
  ];

  private user: User;
  private sidenavMode = "side"

  private onWindowResizeEventSource = new Subject<number>();
  private onToggleSidenavSource = new Subject<boolean>();

  private onWindowResizeEvent$ = this.onWindowResizeEventSource.asObservable();
  private onToggleSidenav$ = this.onToggleSidenavSource.asObservable();

  private windowWidth;

  constructor(private userService: UserService,
  iconRegistry: MdIconRegistry,
  sanitizer: DomSanitizer,
  sidenavService: SidenavService) {
    iconRegistry.addSvgIcon('login', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/login.svg'));
    iconRegistry.addSvgIcon('dashboard', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/view-dashboard.svg'));
    iconRegistry.addSvgIcon('accountCircle', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/account-circle.svg'));
    iconRegistry.addSvgIcon('logout', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/logout.svg'));
    iconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/menu.svg'));
    iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_search_black_24px.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_edit_black_18px.svg'));
    iconRegistry.addSvgIcon('checkmark', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_check_circle_black_18px.svg'));
    iconRegistry.addSvgIcon('comment', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_comment_black_18px.svg'));
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_delete_black_18px.svg'));
    iconRegistry.addSvgIcon('save', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_save_black_18px.svg'));
    iconRegistry.addSvgIcon('undo', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_undo_black_18px.svg'));

    let toggleListener = sidenavService
    .toggleSidenavNotification$
    .subscribe(onNext => {
      this.toggleSidenav();
    });

    this.onWindowResizeEvent$
    .subscribe(windowWidth => {
        this.windowWidth = windowWidth;
        this.sidenavMode = windowWidth > 959 ? "side" : "over";
        this.sidenavMode === "side" ? this.sideNav.open() : this.sideNav.close();
      });

    this.onToggleSidenav$.subscribe(shouldToggle => {
      shouldToggle ? this.sideNav.toggle() : this.sideNav.open();
    });
  }

  ngOnInit() {
    this.user = this.userService.user;

    this.userService.onDeliverableUser$.subscribe(user => {
      this.user = user;
    }, err => {
      console.log(err);
    });

    this.windowWidth = window.innerWidth;
    this.sidenavMode = window.innerWidth > 960 ? "side" : "over";
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.onWindowResizeEventSource.next(window.innerWidth);
  }

  toggleSidenav() {
    this.onToggleSidenavSource.next(this.windowWidth < 960);
  }

}
