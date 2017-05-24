import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SidenavService {

  private toggleSidenavNotificationSource = new Subject<void>();
  
  toggleSidenavNotification$ = this.toggleSidenavNotificationSource.asObservable();

  constructor() {}

  sendToggleNotification() {
	this.toggleSidenavNotificationSource.next();
  }

}