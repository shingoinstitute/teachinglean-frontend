import {
  Component, 
  Input,
  OnDestroy,
  HostListener
} from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnDestroy {

  @Input() userDoesExist: boolean;
  userSubscription: Subscription;
  windowWidth: number = window.innerWidth;

  constructor(
    private userService: UserService) {
    this.userSubscription = userService.userLoginAnnounce$.subscribe(
      userIsAuthenticated => {
        this.userDoesExist = userIsAuthenticated;
      }
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.windowWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  resize(event) {
    this.windowWidth = window.innerWidth;
  }

  onClickLogout() {
    this.userService.logoutUser();
  }

}
