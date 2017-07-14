import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Globals } from '../globals';
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  spinnerEnabled = false;
  showCreateAccount = false;
  loginError: string;
  username = '';
  password = '';
  baseUrl;

  constructor(private userService: UserService, private router: Router, private activeRoute: ActivatedRoute) {
    this.baseUrl = Globals.baseApiUrl;
  }

  ngOnInit() {
    if (this.router.url.includes('auth/linkedin/callback')) {
      this.linkedinCallbackHanlder();
    }
  }

  linkedinCallbackHanlder() {
    this.userService.onDeliverableUser$.subscribe(user => {
      this.router.navigateByUrl('/dashboard');
      console.log(`reroute to dashboard for user ${user.uuid}`);
    }, err => {
      console.error(err);
      this.router.navigateByUrl('/login');
    });

    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.userService.csrfToken = params['xsrf-token'];
      this.userService.getAuthenticatedUser();
    });
  }

  @HostListener('window:keyup.enter', ['$event'])
  keyupHandler() {
    if (this.username.length > 0 && this.password.length > 0) {
      this.onClickLogin();
    }
  }

  onClickLogin() {
    this.spinnerEnabled = true;
    this.userService.localLogin(this.username, this.password)
    .subscribe((data) => {
      this.router.navigate(['/dashboard']);
      console.log(data);
    }, (error) => {
      this.spinnerEnabled = false;
      let errMsg;
      if (error instanceof String) {
        errMsg = error;
      } else if (error.message) {
        errMsg = error.message;
      } else if (error.toString) {
        errMsg = error.toString();
      }
      console.error(errMsg);
      this.loginError = errMsg; 
    });
  }

  authenticateLinkedin(e) {
    this.userService.authenticateLinkedin();
    console.log(e);
  }

}
