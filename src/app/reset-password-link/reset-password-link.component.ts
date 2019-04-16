
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { UserService } from '../services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reset-password-link',
  templateUrl: './reset-password-link.component.html',
  styleUrls: ['./reset-password-link.component.css'],
  animations: [
    trigger('flyInOut', [
      state('out', style({ opacity: 0, transform: 'translateY(-100%)' })),
      state('in', style({ opacity: 1, transform: 'translateY(0)'})),
      transition('* => out', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate(200)
      ]),
      transition('* => in', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate(200)
      ])
    ])
  ]
})
export class ResetPasswordLinkComponent implements AfterViewInit { 
  
  private emailChangeObserver: Subject<string> = new Subject<string>();
  private emailChanged$ = this.emailChangeObserver.asObservable();

  private _email: string;
  get email(): string {
    return this._email;
  }
  set email(newVal: string) {
    let oldVal = this._email || "";
    this._email = newVal;
    if (newVal.length === 0) {
      this.didFindEmail = null;
    } else if (newVal.includes('@') || (oldVal.length > newVal.length)) { 
      this.isSearching = true;
      this.emailChangeObserver.next(this._email);
    }
  }

  constructor(private zone: NgZone, private cdref: ChangeDetectorRef, private userservice: UserService) {}

  didClickRequestButton: boolean;
  onSuccessMsg: string;
  formState: string = "";
  completeState: string = "";
  onSubmit() {
    this.didClickRequestButton = true;
    this.isSearching = true;
    this.userservice.sendPasswordResetLink(this.email).subscribe(data => {
      this.formState = "out";
      this.onSuccessMsg = data.info;
      this.isSearching = false;
    }, err => {
      this.isSearching = false;
      console.error(err);
    });
  }

  showForm: boolean = true;
  animationDone() {
    let ctrl = this;
    if (ctrl.formState === 'out') {
      setTimeout(() => {
        ctrl.showForm = false;
        ctrl.completeState = 'in';
      }, 200);
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular( () => {
      this.emailChanged$.pipe(debounceTime(750),
      distinctUntilChanged(),)
      .subscribe(email => {
        this.checkEmailCollisions(email);
      });
    });
  }

  isSearching: boolean;
  didFindEmail: boolean;
  /**
   * @desc :: checks to see if the email entered exists.
   */
  checkEmailCollisions(email: string) {    
    this.userservice.checkEmailCollisions(email).subscribe(data => {
      this.didFindEmail = data.doesExist;
      this.isSearching = false;
      this.cdref.detectChanges();
    });
  }

}
