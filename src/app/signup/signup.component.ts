import {Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';

import { User } from '../user/user';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  private user: User = new User();
  private username: string;
  private password = "";
  private confirmPassword = "";
  errorMsg: string;

  private formIsValid = false;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.user.username = "";
    this.buildForm();
  }

  private formFields = [
    'firstname',
    'lastname',
    'username',
    'email',
    'password',
    'confirmPassword'
  ]

  buildForm() {
    this.signupForm = this.fb.group({
      'firstname': [this.user.firstname, Validators.required ],
      'lastname': [this.user.lastname, Validators.required ],
      'username': [this.user.username, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(24)
      ]],
      'email': [this.user.email, [
        Validators.required,
        Validators.email
      ]],
      'password': [this.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18)
      ]],
      'confirmPassword': [this.confirmPassword, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18)
      ]]
    });

    this.signupForm.valueChanges.subscribe(changes => {
      this.onValueChanged(changes);
    });

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.signupForm) { return; }

    const passwordControl = this.signupForm.get('password');
    const confirmPasswordControl = this.signupForm.get('confirmPassword');

    if (passwordControl.dirty && confirmPasswordControl.dirty) {
        if (passwordControl.value != confirmPasswordControl.value) {
          passwordControl.setErrors({
            passwordMismatch: true
          });
          confirmPasswordControl.setErrors({
            passwordMismatch: true
          });
        } else {
          passwordControl.setErrors(null);
          confirmPasswordControl.setErrors(null);
        }
    }
    

    this.formIsValid = this.signupForm.valid;
  }

  onSubmit() {
    if (this.password === this.confirmPassword) {
      let user = {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email
      }
      this.userService.create(user, this.password)
        .subscribe(
          result => {
            this.router.navigate(['dashboard']);
          },
          error => {
            console.error(error);
            this.errorMsg = error.message ? error.message : error;
          }
        );
    }
  }

}
