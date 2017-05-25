import { Component, OnInit } from '@angular/core';

import { MdDialog, MdDialogRef } from '@angular/material';
import { DisableUserDialog } from './disable-user.dialog';
import { UserService } from '../services/user.service';

import { User } from '../user/user';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  private users: User[];
  private admin: User;

  roles = [
    { value: "System Admin", viewValue: "System Admin" },
    { value: "admin", viewValue: "Admin" },
    { value: "editor", viewValue: "Editor" },
    { value: "author", viewValue: "Author" },
    { value: "moderator", viewValue: "Moderator" },
    { value: "user", viewValue: "Member" }
  ]

  constructor(private userService: UserService, public dialog: MdDialog) {
    userService.getUserAsync()
    .then(admin => this.admin = admin)
    .catch(err => console.error(err));

    userService.getUsersAsync()
    .then((users: User[]) => this.users = users)
    .catch(err => console.error(err));

  }

  ngOnInit() {
  }

  getLastLogin(user: User) {
    if (user.lastLogin) {
      let lastLogin = new Date(user.lastLogin);
      return `${lastLogin.toLocaleDateString([], {month: "short", day: "numeric", year: "numeric"})}, ${lastLogin.toLocaleTimeString([], {"hour": "2-digit", "minute": "2-digit", "hour12": true})}`;
    }
  }

  updateUser(user: User) {
    this.userService.updateUser(user)
    .then((user: User) => {
      user = user;
    })
    .catch(err => console.error(err));
  }

  onClickStatus(user: User) {
    if (!user.accountIsActive) {
      user.accountIsActive = true;
      this.updateUser(user);
    } else {
      let dialogRef = this.dialog.open(DisableUserDialog);
      dialogRef.afterClosed().subscribe( result => {
        user.accountIsActive = result;
        this.updateUser(user);
      });
    }
  }

  parseRole(user: User) {
    let role;
    switch (user.role) {
      case "systemAdmin":
        role = "System Admin";
        break;
      case "admin":
        role = "Admin";
        break;
      case "author":
        role = "Author";
        break;
      case "editor":
        role = "Editor";
        break;
      case "moderator":
        role = "Moderator";
        break;
      default: 
        role = "Member";
        break;
    }
    return role;
  }

}


