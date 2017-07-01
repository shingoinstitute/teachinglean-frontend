import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../user/user';

import { UserService } from '../../services/user.service';

@Component({
   selector: 'admin-user-card',
   templateUrl: './admin-user-card.component.html',
   styleUrls: ['./admin-user-card.component.css']
})
export class AdminUserCardComponent {

   @Input('user') user: User = new User();
   @Output('onBack') backEventEmitter = new EventEmitter<void>();

   constructor(private userService: UserService) {
   }

   ngAfterViewInit() {
      this.userService.getAuthUser().subscribe(user => {
         this.user = User.initFromObject(user);
      }, err => {
         console.error(err);
      });
   }
   

}