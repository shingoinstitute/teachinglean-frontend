import {
  Component, 
  OnInit, 
  ViewChild, 
  HostListener
} from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSidenav } from '@angular/material';
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
    {name: "QA Forum", path: "/forum"},
    {name: "Teaching And Curriculum", path: "/teaching"},
    {name: "About Us", path: "/about"}
  ];

  user: User;
  sidenavMode = "side"

  onWindowResizeEventSource = new Subject<number>();
  onToggleSidenavSource = new Subject<boolean>();

  onWindowResizeEvent$ = this.onWindowResizeEventSource.asObservable();
  onToggleSidenav$ = this.onToggleSidenavSource.asObservable();

  windowWidth;

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
    iconRegistry.addSvgIcon('save_white', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_save_white_18px.svg'));
    iconRegistry.addSvgIcon('undo', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_undo_black_18px.svg'));
    iconRegistry.addSvgIcon('done', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_done_green_18px.svg'));
    iconRegistry.addSvgIcon('clear', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_clear_red_18px.svg'));
    iconRegistry.addSvgIcon('arrow_up', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_arrow_upward_white_18px.svg'));
    iconRegistry.addSvgIcon('arrow_down', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_arrow_downward_white_18px.svg'));
    iconRegistry.addSvgIcon('arrow_forward', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_arrow_forward_white_18px.svg'));
    iconRegistry.addSvgIcon('arrow_back', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_arrow_back_white_18px.svg'));
    iconRegistry.addSvgIcon('lock_white', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_lock_open_white_18px.svg'));
    iconRegistry.addSvgIcon('unlock_white', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_lock_outline_white_18px.svg'));
    iconRegistry.addSvgIcon('lock_black', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_lock_outline_black_18px.svg'));
    iconRegistry.addSvgIcon('unlock_black', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_lock_open_black_18px.svg'));
    iconRegistry.addSvgIcon('eye_black', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_remove_red_eye_black_18px.svg'));
    iconRegistry.addSvgIcon('pdf_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_file_download_grey_24px.svg'));

    sidenavService
    .toggleSidenavNotification$
    .subscribe(() => {
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
      console.error(err);
    });

    this.userService.onUserLogout$.subscribe(() => {
      this.user = null;
    }, err => {
      this.user = null;
      console.error(err);
    });

    this.windowWidth = window.innerWidth;
    this.sidenavMode = window.innerWidth > 960 ? "side" : "over";
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.onWindowResizeEventSource.next(window.innerWidth);
  }

  toggleSidenav() {
    this.onToggleSidenavSource.next(this.windowWidth < 960);
  }

}
