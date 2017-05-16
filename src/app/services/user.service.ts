import { Injectable } from '@angular/core';
import {Http, Response, ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User } from '../user/user';
import { Globals } from '../globals';

@Injectable()
export class UserService {

    baseApiUrl: string;

    constructor(private http: Http) {
      this.baseApiUrl = Globals.baseApiUrl;
    }

    getUser(): Observable<User> {
        return this.http.get(this.baseApiUrl + '/me')
            .map(this.extractData)
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
