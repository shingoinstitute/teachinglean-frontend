import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../user/user';
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  user: User = new User();
  username = '';
  password = '';
  errMsg: string;

  passwordType = "password";
  formIsValid = false;

  validationMessages = {
    required: 'this field is required',
    username: {
      minLength: 'username must be at least 3 characters',
      maxLength: 'username too long, must be less than 24 characters'
    },
    email: {
      invalid: 'invalid email address'
    },
    password: {
      minLength: 'password must be at least 6 characters',
      maxLength: 'password too long, must be less than 18 characters'
    }
  }

  formErrors = {
    'required': this.validationMessages.required,
    'username': '',
    'email': '',
    'password': ''
  }

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.signupForm = this.fb.group({
      'firstname': [this.user.firstname, Validators.required ],
      'lastname': [this.user.lastname, Validators.required ],
      'username': [this.user.username, [
        Validators.required,
        Validators.minLength(3),
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
      ]]
    });

    this.signupForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });
  }

  onValueChanged() {
    if (!this.signupForm) { return; }
    const form = this.signupForm;
    let control;

    control = form.get('username');
    if (Validators.required(control)) {
      this.formErrors.username = this.validationMessages.required;
    } else if (Validators.minLength(control)) {
      this.formErrors.username = this.validationMessages.username.minLength;
    } else if (Validators.maxLength(control)) {
      this.formErrors.username = this.validationMessages.username.maxLength;
    }

    control = form.get('email');
    if (Validators.required(control)) {
      this.formErrors.email = this.validationMessages.required;
    } else if (Validators.email(control)) {
      this.formErrors.email = this.validationMessages.email.invalid;
    }

    control = form.get('password');
    if (Validators.required(control)) {
      this.formErrors.password = this.validationMessages.required;
    } else if (Validators.minLength(control)) {
      this.formErrors.password = this.validationMessages.password.minLength;
    } else if (Validators.maxLength(control)) {
      this.formErrors.password = this.validationMessages.password.maxLength;
    }

    this.formIsValid = this.signupForm.valid;
  }

  onclickShowBtn() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    let user = {
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email
    }
    this.userService.create(user, this.password).subscribe(result => {
      this.router.navigate(['dashboard']);
      console.log(result);
    }, error => {
      let errMsg = error;
      if (error.toString) { errMsg = error.toString(); }
      else if (error.message) { errMsg = error.message; }
      console.error(errMsg);
      this.errMsg = errMsg;
    });
  }

}
