import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { DisableUserDialog } from './disable-user.dialog';
import { UserService } from '../services/user.service';

import { User } from '../user/user';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements AfterViewInit {

  users: User[];
  admin: User;
  private _shouldLoadData;

  roles = [
    { value: "systemAdmin", displayValue: "System Admin" },
    { value: "admin", displayValue: "Admin" },
    { value: "editor", displayValue: "Editor" },
    { value: "author", displayValue: "Author" },
    { value: "moderator", displayValue: "Moderator" },
    { value: "user", displayValue: "Member" }
  ]

  constructor(private userService: UserService, public dialog: MdDialog, private snackbar: MdSnackBar, cookieService: CookieService) {
    let index = +cookieService.get('selectedDashboardTab');
    this._shouldLoadData = index && index === 2;
  }

  ngAfterViewInit() {
    this._shouldLoadData && this.loadData();
  }

  loadData() {
    this.getAdminUser();
    this.getUsers();
  }

  private getAdminUser() {
    this.admin = this.userService.user;
    this.userService.getAuthUser().subscribe(user => {
      this.admin = user;
    });
  }

  private getUsers() {
    this.userService.getUsersAsync()
    .then(users => {
      this.users = users.map(User.initFromObject);
    })
    .catch(err => console.error(err));
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe(user => {
      user = User.initFromObject(user);
      this.snackbar.open('Succesfully Updated User.', null, { duration: 2500 })
    }, err => console.error(err));
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
    switch (user.role) {
      case "systemAdmin":
        return "System Admin";
      case "admin":
        return "Admin";
      case "author":
        return "Author";
      case "editor":
        return "Editor";
      case "moderator":
        return "Moderator";
      case "user": 
        return "Member";
    }
    return "unassigned";
  }

}


