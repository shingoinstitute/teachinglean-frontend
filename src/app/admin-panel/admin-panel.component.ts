import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';

// Delete me
import { Http } from '@angular/http';

import { CookieService } from 'ngx-cookie';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { DisableUserDialog } from './disable-user.dialog';
import { UserService } from '../services/user.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { User } from '../user/user';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements AfterViewInit {
  private getUserSubscriptionSource = new Subject<number>();
  getUserSubscription$: Observable<any> = this.getUserSubscriptionSource.asObservable();

  users: User[];
  admin: User;
  // stats: { size: number };

  // DELETE AFTER TESTING
     stats: {size:number} = { size: 300 };
  //---------------------

  private _shouldLoadData;

  private _page: number = 1;
  get page(): number {
    return this._page;
  }
  set page(prevVal: number) {
    console.log(prevVal);
    if (prevVal < 1) { this._page = 1;
    } else if (prevVal > this.maxPage) { this._page = this.maxPage;
    } else { this._page = prevVal; }
    console.log('page: ' + this._page);
    this.getUserSubscriptionSource.next(this._page);
  }
  get maxPage(): number {
    if (!this.stats) return 1;
    return Math.ceil(this.stats.size / this.limit);
  }
  private limit: number = 10;

  roles = [
    { value: "systemAdmin", displayValue: "System Admin" },
    { value: "admin", displayValue: "Admin" },
    { value: "editor", displayValue: "Editor" },
    { value: "author", displayValue: "Author" },
    { value: "moderator", displayValue: "Moderator" },
    { value: "user", displayValue: "Member" }
  ]

  constructor(private userService: UserService, 
              public dialog: MdDialog, 
              private snackbar: MdSnackBar, 
              cookieService: CookieService, 
              private zone: NgZone,
              private cdref: ChangeDetectorRef,
              private http: Http) {
    let index = +cookieService.get('selectedDashboardTab');
    this._shouldLoadData = index && index === 2;
  }

  ngAfterViewInit() {
    /** Prevent data from loading prematurely since this component can be loaded before it appears on screen */
    if (this._shouldLoadData) { this.loadData(); }
  }

  loadData() {
    this.getAdminUser();

    /** use zone.run() to achieve synchronous execution */
    this.zone.run(() => {
      // this.getStats();
      this.getUsers();
    });

    /*** run outside angular to avoid rapid change detection (performance issues) */
    this.zone.runOutsideAngular(() => {
      /*** Add debounce time to protect against rapid pagination clicks */
      this.getUserSubscriptionSource.debounceTime(500)
      .distinctUntilChanged()
      .subscribe(() => {
        console.log(`page #${this.page}`);
        this.getUsersDev(this.limit, this._page)
        .subscribe(data => {
          let users = data.users;
          this.users = users.map(User.initFromObject);
        });
        // this.userService.getUsers(this.limit, this.page)
        // .subscribe(users => {
        //   this.users = users.map(User.initFromObject);
        //   this.cdref.detectChanges(); // explicitly tell angular to run change detection
        // }, err => {
        //   console.error(err);
        // });
      });
    });
  }

  /** Gets currently authenticated user as the admin */
  private getAdminUser(): void {
    this.admin = this.userService.user;
    if (!this.admin) {
      this.userService.getAuthUser().subscribe(user => {
        this.admin = user;
      });
    }
  }
/** 
 * @desc :: Gets users to display. `this.limit` and `this.page` are used together
 * to create a pagination system, where a "skip" value is calculated using
 * `this.limit * this.page`.
 */
  private getUsers(): void {
    // this.userService.getUsers(this.limit, this.page)
    // .subscribe(users => {
    //   this.users = users.map(User.initFromObject);
    // }, err => console.error(err));
    this.getUsersDev(this.limit, this._page)
    .subscribe(data => {
      let users = data.users;
      this.users = users.map(User.initFromObject);
    }, err => console.error(err));
  }

  /** Gets user-base statitics to use for pagination */
  private getStats(): void {
    this.userService.getStats().subscribe(stats => {
      this.stats = { size: stats.size };
    }, err => {
      console.error(err);
    });
  }

  paginateForward() {
    this.page = this.page + 1;
    // this.getUsers();
    this.updatePaginationBtns();
  }

  paginateBack() {
    this.page = this.page - 1;
    // this.getUsers();
    this.updatePaginationBtns();
  }

  updatePaginationBtns() {
    this.cdref.detectChanges();
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



  getUsersDev(limit: number, page: number) {
    return this.http.get(`http://localhost:3000/backend/user/randUsers?limit=${limit}&skip=${limit*page}`)
    .map(res => {
      let data = res.json();
      console.log(data);
      return data;
    })
    .catch(err => {
      return Observable.throw(err);
    });
  }



}


