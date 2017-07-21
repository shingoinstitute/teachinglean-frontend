import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../user/user';

@Component({
   selector: '[admin-user-list-item]',
   templateUrl: './admin-user-list-item.component.html',
   styleUrls: ['./admin-user-list-item.component.css']
})
export class AdminUserListItemComponent {

   @Input('user') user: User;
   @Output('onSelect') selectUserEventEmitter = new EventEmitter<User>();
   @Output('onChange') onUpdateUserEventEmitter = new EventEmitter<User>();
   @Output('onBlock') onSelectBlockEventEmitter = new EventEmitter<User>();

   onSelectBlock() {
      this.onSelectBlockEventEmitter.emit(this.user);
   }

   onSelectUnblock() {
      this.user.accountIsActive = true;
      this.onUpdateUserEventEmitter.emit(this.user);
   }

}