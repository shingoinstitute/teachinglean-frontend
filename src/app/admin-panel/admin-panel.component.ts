import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

// Delete me
import { Http } from '@angular/http';

import { CookieService } from 'ngx-cookie';
import { MdSnackBar, MdDialog } from '@angular/material';
import { DisableUserDialog } from './disable-user.dialog';
import { UserService } from '../services/user.service';
import { Observable, Subscription, Subject } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { User } from '../user/user';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements AfterViewInit {

  private isDevEnv = true;

  private getUserSubscriptionSource = new Subject<number>();

  users: User[];
  admin: User;
  stats: { size: number } = { size: 0 };

  private _shouldLoadData;

  private _page: number = 1;
  get page(): number {
    return this._page;
  }
  set page(prevVal: number) {
    if (prevVal < 1) { this._page = 1;
    } else if (prevVal > this.maxPage) { this._page = this.maxPage;
    } else { this._page = prevVal; }
    this.updatePaginationBtns();
    this.getUserSubscriptionSource.next(this._page);
  }

  currPage: number = this.page;

  get maxPage(): number {
    if (!this.stats) return 1;
    return Math.ceil(this.stats.size / this.limit);
  }
  private _limit: number = 10;
  get limit(): number { return this._limit; }
  set limit(val: number) {
    this._limit = val;
    this.getUserSubscriptionSource.next();
  }
  
  constructor(private userService: UserService, 
              private snackbar: MdSnackBar,
              public dialog: MdDialog,
              cookieService: CookieService, 
              private zone: NgZone,
              private cdref: ChangeDetectorRef,
              private http: Http) {
    let index = +cookieService.get('selectedDashboardTab');
    this._shouldLoadData = index && index === 2;
  }

  ngAfterViewInit() {
    /** Prevent data from loading prematurely since this component can be loaded before it appears on screen */
    if (this._shouldLoadData) {
        this.admin = this.userService.user;
        this.getStats().then((stats) => {
          this.stats = { size: stats.size };
          this.loadData();
        }).catch(err => {
          console.error(err);
        });
    }
  }

  loadData() {
    /*** run outside angular to avoid rapid change detection (performance issues) */
    this.zone.runOutsideAngular(() => {
      /*** Add debounce time to protect against rapid pagination clicks */
      this.getUserSubscriptionSource.debounceTime(500)
      .distinctUntilChanged()
      /** .subscribe().next() triggered on value changes of `this.page`, causing an update to `this.users` */
      .subscribe(() => {
        this.getUsers();
      });
      this.getUserSubscriptionSource.next();
    });
  }
  
/** 
 * @desc :: Gets users to display. `this.limit` and `this.page` are used together
 * to create a pagination system, where a "skip" value is calculated using
 * `this.limit * this.page`.
 */
  private getUsers(): void {
    this.userService.getUsers(this.limit, this.page, this.isDevEnv)
    .subscribe(users => {
      this.users = users.map(User.initFromObject);
      this.currPage = this.page;
      this.cdref.detectChanges(); // explicitly tell angular to run change detection
    }, err => console.error(err));
  }

  /** Gets user-base statitics (used for pagination) */
  private getStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getStats(this.isDevEnv).subscribe(stats => {
        return resolve(stats);
      }, err => {
        return reject(err);
      });
    })
  }

  btn1 = 1;
  btn2 = 2;
  btn3 = 3;
  btn4 = 4;
  btn5 = 5;
  updatePaginationBtns() {
    if (this.page == 1 || this.page == 2) {
      this.btn1 = 1;
      this.btn2 = this.btn1+1;
      this.btn3 = this.btn2+1;
      this.btn4 = this.btn3+1;
      this.btn5 = this.btn4+1;
    } else if (this.page > 2 && this.page < this.maxPage - 1) {
      this.btn1 = this.page - 2;
      this.btn2 = this.btn1+1;
      this.btn3 = this.btn2+1;
      this.btn4 = this.btn3+1;
      this.btn5 = this.btn4+1;
    } else if (this.page == this.maxPage - 1 || this.page == this.maxPage){
      this.btn1 = this.btn2-1;
      this.btn2 = this.btn3-1;
      this.btn3 = this.btn4-1;
      this.btn4 = this.btn5-1;
      this.btn5 = this.maxPage;
    }
    
  }

  updateUser(user: User) {
    !this.isDevEnv && this.userService.updateUser(user).subscribe(user => {
      user = User.initFromObject(user);
      this.snackbar.open('Succesfully Updated User.', null, { duration: 2500 })
    }, err => console.error(err));
  }


  onSelectBlock(user: User) {
    let dialogRef = this.dialog.open(DisableUserDialog);
    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
      user.accountIsActive = result;
      if (result && !this.isDevEnv) {
        this.updateUser(user);
      }
    });
  }
  

  //TODO:: Show user details on click
  onSelectUser(user) {
    console.log('recieved user', user);
  }

}


