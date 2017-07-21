import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { MdSnackBar, MdDialog, MdSort, MdPaginator } from '@angular/material';
import { DisableUserDialog } from './disable-user.dialog';
import { UserService } from '../services/user.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/debounce';
import { User } from '../user/user';
import { UserDataSource, UserDataProvider } from "app/services/user-data-provider";

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [UserDataProvider]
})
export class AdminPanelComponent {

  public dataSource: UserDataSource | null;
  public displayedColumns = ["name", "email", "username", "role", "actions"];
  public selectedUser: User;

  public roles = {
    systemAdmin: "System Admin",
    admin: "Admin",
    editor: "Editor",
    author: "Author",
    moderator: "Moderator",
    user: "Member"
  }

  private _shouldLoadData;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(private userService: UserService,
              private snackbar: MdSnackBar,
              public dialog: MdDialog,
              public udp: UserDataProvider,
              cookieService: CookieService) {
    let index = +cookieService.get('selectedDashboardTab');
    this._shouldLoadData = index && index === 2;
  }

  ngOnInit() {
    this.dataSource = new UserDataSource(this.udp, this.paginator, this.sort);
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe(user => {
      user = User.initFromObject(user);
      this.snackbar.open('Succesfully Updated User.', null, { duration: 2500 })
    }, err => console.error(err));
  }


  onBlockUserHandler(user: User) {
    let dialogRef = this.dialog.open(DisableUserDialog);
    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
      user.accountIsActive = result;
      if (!result) {
        this.updateUser(user);
      }
    });
  }

}


