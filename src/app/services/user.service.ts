import { Injectable } from '@angular/core';
import {Http, Response, ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User } from '../user/user';
import { Globals } from '../globals';

@Injectable()
export class UserService {

    private _user: User;

    get user(): User {
      return this._user;
    }

    setUser(user: User) {
      this._user = user;
    }

    userLoggedIn(): boolean {
      return !(this._user === undefined || this._user === null);
    }

    baseApiUrl: string;

    constructor(private http: Http, private cookieService: CookieService) {
      this.baseApiUrl = Globals.baseApiUrl;
    }

    getUser(): Observable<any> {
        return this.http.get(this.baseApiUrl + '/me')
            .map(response => {
              let data = response.json();
              this._user = new User();
              this._user.initFromObject(data);
              return this._user;
            })
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
      this._user = null;
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

    private extractData(res: Response) {
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
