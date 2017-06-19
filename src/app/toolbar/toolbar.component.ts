import {
  Component,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../services/user.service';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  userDoesExist: boolean;
  userSubscription: Subscription;
  windowWidth: number = window.innerWidth;

  constructor(
    private userService: UserService,
    private router: Router,
    private sidenav: SidenavService) {
    
    this.userDoesExist = userService.user != null
    userService.onDeliverableUser$.subscribe(user => {
      this.userDoesExist = !!user;
    }, err => {
      console.log(err);
    });

  }

  ngAfterViewInit() {
    this.windowWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  resize(event) {
    this.windowWidth = window.innerWidth;
  }

  toggleSidenav() {
    this.sidenav.sendToggleNotification();
  }

  onClickLogout() {
    this.userService.logoutUser().subscribe(data => {
      this.router.navigate(['/']);
    }, err => {
      console.error(err);
    });
  }

}
