import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SidenavService {

  private toggleSidenavNotificationSource = new Subject<void>();
  
  toggleSidenavNotification$ = this.toggleSidenavNotificationSource.asObservable();

  constructor() {}

  sendToggleNotification() {
	this.toggleSidenavNotificationSource.next();
  }

}