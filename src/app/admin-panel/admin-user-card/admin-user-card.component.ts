import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { User } from '../../user/user';

import { UserService } from '../../services/user.service';

@Component({
   selector: 'admin-user-card',
   templateUrl: './admin-user-card.component.html',
   styleUrls: ['./admin-user-card.component.css']
})
export class AdminUserCardComponent {

   @Input('user') user: User = new User();
   @Output('onClose') backEventEmitter = new EventEmitter<void>();
   @Output('onBlockUser') blockEventEmitter = new EventEmitter<User>();

   constructor(private userService: UserService, private snackbar: MdSnackBar) {}

   saveChanges() {
      this.userService.updateUser(this.user).subscribe(user => {
         this.snackbar.open(`Successfully updated ${user.name}`, null, { duration: 2500 });
         this.backEventEmitter.emit();
      }, err => {
         console.error(err);
         this.snackbar.open('An error occurred and the operation could not be completed. If this problem persists, please contact shingo.it@usu.edu', 'Okay', {
            extraClasses: ['snackbar-err']
          });
      });
   }

   onUnblock() {
      this.user.accountIsActive = true;
      this.saveChanges();
   }

}