import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import { CookieService } from 'ngx-cookie';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MatSort, MatPaginator } from '@angular/material';

import { Subject } from 'rxjs';



import { User } from '../user/user';
import { UserService } from '../services/user.service';
import { DisableUserDialog } from './disable-user.dialog';
import { UserDataProvider} from "app/services/user-data-provider.service";
import { UserDataSource } from 'app/services/user-data-source';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [ UserDataProvider ]
})
export class AdminPanelComponent implements OnInit {

  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild(MatPaginator) public paginator: MatPaginator;

  public displayedColumns: string[] = ['name', 'role', 'actions'];
  public dataSource: UserDataSource | null;
  public selectedUser: User;
  public roles = {
    systemAdmin: 'System Admin',
    admin: 'Admin',
    editor: 'Editor',
    author: 'Author',
    moderator: 'Moderator',
    user: 'Member'
  };

  private _shouldLoadData: boolean;

  constructor(
    public dialog: MatDialog,
    public _udp: UserDataProvider,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private cookieService: CookieService
  ) {
    let index = +cookieService.get('selectedDashboardTab');
    this._shouldLoadData = index && index === 2;
  }

  ngOnInit() {
    this.dataSource = new UserDataSource(this._udp, this.paginator, this.sort);
    this.setDisplayedColumns();
    this.dataSource.connect().subscribe(data => {
      console.log('updated data:', data);
    });
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe(user => {
      user = User.initFromObject(user);
      this.snackbar.open('Succesfully Updated User.', null, { duration: 2500 })
    }, err => {
      console.error(err);
      this.snackbar.open('An error occurred and the operation could not be completed. If this problem persists, please contact shingo.it@usu.edu', 'Okay', {
        extraClasses: ['snackbar-err']
      });
    });
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setDisplayedColumns();
  }

  private setDisplayedColumns() {
    this.displayedColumns = window.innerWidth > 960 ? ['name', 'email', 'username', 'role', 'actions'] : ['name', 'role', 'actions'];
  }

}


