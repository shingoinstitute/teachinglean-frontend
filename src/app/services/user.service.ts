import {
  Http, 
  Response, 
  ResponseContentType
} from '@angular/http';
import { Router } from '@angular/router';
import { Injectable }    from '@angular/core';
import { Observable }    from 'rxjs/Observable';
import { Subject }       from 'rxjs/Subject';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User }    from '../user/user';
import { Globals } from '../globals';

@Injectable()
export class UserService {
  
  // Observable sources
  private userLoginDetectedSource = new Subject<User>();
  private userLoginAnnounceSource = new Subject<boolean>();

  // Observable streams
  userLoginDetected$ = this.userLoginDetectedSource.asObservable();
  userLoginAnnounce$ = this.userLoginAnnounceSource.asObservable();
  
  announceLogin(isAuthenticated: boolean) {
    this.userLoginAnnounceSource.next(isAuthenticated);
  }

  // User object
  private _user: User;
  
  get user(): User {
    return this._user;
  }
  
  set user(user: User) {
    this._user = user;
  }
  
  baseApiUrl: string;
  
  constructor(private http: Http, private cookieService: CookieService, private router: Router) {
    this.baseApiUrl = Globals.baseApiUrl;
  }
  
  getUser(): Observable<any> {
    return this.http.get(this.baseApiUrl + '/me')
    .map((res) => this.extractUserFromResponse(res))
    .catch(this.handleError);
  }
  
  localLogin(username, password): Observable<any> {
    return this.http.post(this.baseApiUrl + '/auth/local', {
      username: username,
      password: password
    })
    .map(result => {
      return result.json();
    })
    .catch(this.handleError);
  }
  
  logoutUser() {
    // TODO :: make call to '/logout' to remove cookies and headers
    this._user = null;
    this.http.get(this.baseApiUrl + '/logout')
    .map((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.message);
      return Observable.throw(err);
    });
    this.router.navigate(['/']);
  }
  
  signUp(user: User, password: string): Observable<any> {
    return this.http.post(this.baseApiUrl + '/user', {
      email: user.email,
      password: password,
      firstname: user.firstname,
      lastname: user.lastname
    }, {
      responseType: ResponseContentType.Json
    })
    .map(response => {
      return response.json();
    })
    .catch(this.handleError);
  }
  
  private extractUserFromResponse(res: Response | any): Observable<User> {
    let data;
    try {
      data = res.json();
      this._user = User.initFromObject(data);
    } catch(e) {
      return Observable.throw(e.message);
    }
    this.onLoginDetected(this._user);
    // TODO :: this function shouldn't return an Observable if it's calling 'this.userLoginDetectedSource.next()'
    return Observable.create(this._user);
  }
  
  onLoginDetected(user: User) {
    this.userLoginDetectedSource.next(user);
  }

  private extractData(res: Response): Observable<any> {
    return res.json();
  }
  
  private handleError(error: Response | any) {
    let err: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      err = body.error || JSON.stringify(body);
    } else {
      err = error.message ? error.message : error.toString();
    }
    return Observable.throw(err);
  }
  
}
