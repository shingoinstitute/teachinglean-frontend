import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../user/user';

@Component({
   selector: '[admin-user-list-item]',
   templateUrl: './admin-user-list-item.component.html',
   styleUrls: ['./admin-user-list-item.component.css']
})
export class AdminUserListItemComponent implements OnInit {

   @Input('user') user: User;
   @Input('id') id: any;
   @Output('onSelect') selectUserEventEmitter = new EventEmitter<User>();
   @Output('onChange') onUpdateUserEventEmitter = new EventEmitter<User>();
   @Output('onBlock') onSelectBlockEventEmitter = new EventEmitter<User>();

   constructor() {}

   ngOnInit() {}

   onSelectBlock() {
      this.onSelectBlockEventEmitter.emit(this.user);
   }

   onSelectUnblock() {
      this.user.accountIsActive = true;
      this.onUpdateUserEventEmitter.emit(this.user);
   }

   roles = {
      systemAdmin: "System Admin",
      admin: "Admin",
      editor: "Editor",
      author: "Author",
      moderator: "Moderator",
      user: "Member"
   }

}