import {
  Component,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../services/user.service';
import { SidenavService } from '../services/sidenav.service';
import { User } from "app/user/user";

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
    
    userService.onDeliverableUser$.subscribe(user => {
      this.userDoesExist = user instanceof User;
    }, err => {
      console.error(err);
    });

    userService.onUserLogout$.subscribe(() => {
      this.userDoesExist = false;
    }, err => {
      console.error(err);
    });

  }

  ngAfterViewInit() {
    this.windowWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  resize() {
    this.windowWidth = window.innerWidth;
  }

  toggleSidenav() {
    this.sidenav.sendToggleNotification();
  }

  onClickLogout() {
    this.userService.logoutUser().subscribe(() => {
      this.router.navigate(['/']);
    }, err => {
      console.error(err);
    });
  }

}
