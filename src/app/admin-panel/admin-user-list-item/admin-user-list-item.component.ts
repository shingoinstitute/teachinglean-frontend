import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../user/user';

@Component({
   selector: '[admin-user-list-item]',
   templateUrl: './admin-user-list-item.component.html',
   styleUrls: ['./admin-user-list-item.component.css']
})
export class AdminUserListItemComponent implements OnInit {

   @Output('selectUser') selectUserEventEmitter = new EventEmitter<User>();
   @Output('onBlock') selectBlockEventEmitter = new EventEmitter<User>();
   @Output('unBlock') selectUnBlockEventEmitter = new EventEmitter<User>();
   @Input('user') user: User;
   @Input('id') id: any;

   constructor(private router: Router) {}

   ngOnInit() {

   }

}