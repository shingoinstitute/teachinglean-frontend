
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, AfterViewInit, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subject } from 'rxjs';



const MIN_LENGTH = 8;
const MAX_LENGTH = 32;
const NUMBER_REGEX = /\d{1}/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*]{1}/;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements AfterViewInit {

  private onPasswordConfirmChange = new Subject<string>();
  private onPasswordConfirm$ = this.onPasswordConfirmChange.asObservable();
  
  private _password: string = "";
  get password(): string {
    return this._password;
  }
  set password(val: string) {
    this._password = val;
    this.isChecking = true;
    this.onPasswordConfirmChange.next(this._password);
  }

  get canSubmit(): boolean {
    return this.isMinLength && this.isMaxLength && this.hasNumber && this.hasSpecial;
  }
  get isMeetLength(): boolean {
    return this.isMinLength && this.isMaxLength;
  }

  private id: string;
  private token: string;
  constructor(private zone: NgZone, private cdref: ChangeDetectorRef, private userService: UserService, private route: ActivatedRoute) {
    /**
     * Get (JWT) token that will be used to authenticate user 
     * on the server when updating their password. This token
     * is obtained from a link sent to their email account.
     */
    this.route.queryParams.subscribe(params => {
      this.token = params.token || "";
    });
    /**
     * Get user's ID as part of the server side identification process
     */
    this.route.params.subscribe(params => {
      this.id = params.id || "";
    });
  }

  isChecking: boolean;
  ngAfterViewInit() {
    /**
     * Create observable with debounce to decrease
     * rapid change detection and validation checking
     * within angular.
     */
    this.zone.runOutsideAngular(() => {
      this.onPasswordConfirm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),)
      .subscribe(password => {
        this.validate(password);
        this.isChecking = false;
        this.cdref.detectChanges();
      });
    });
  }

  isMinLength: boolean;
  isMaxLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  /**
   * @desc :: Validate password that it matches the confirm password
   * and is a minimum length of 8 characters.
   */
  private validate(password: string) {
    this.isMinLength = !(password.length < MIN_LENGTH);
    this.isMaxLength = !(password.length > MAX_LENGTH);
    this.hasNumber = !(password.search(NUMBER_REGEX) < 0);
    this.hasSpecial = !(password.search(SPECIAL_CHAR_REGEX) < 0);
  }

  updateErrMsg: string;
  didUpdate: boolean;
  /**
   * @desc :: Upon clicking the submit button, sends request 
   * to server to update users current password
   */
  onSubmit() {
    this.userService.updatePassword(this.password, this.id, this.token).subscribe(data => {
      this.didUpdate = true;
      console.log(data);
    }, err => {
      this.updateErrMsg = "Hmm, there was a problem updating your password. Try using the reset link sent to your email again and if the problem persists, please contact our technical support team at shingo.it@usu.edu."
      console.error(err);
    });
  }

  @ViewChild('pwordInput') passwordInput: ElementRef;
  /**
   * @desc :: Toggles the password input field between type `password` and type `text`
   * so the user can visibly see what they have typed as their new password.
   */
  onclickShow() {
    let type = $(this.passwordInput.nativeElement).attr('type') === 'password' ? 'text' : 'password';
    $(this.passwordInput.nativeElement).get(0).setAttribute('type', type);
  }

}
