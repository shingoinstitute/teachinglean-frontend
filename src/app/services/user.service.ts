import {
  Http, 
  Response, 
  ResponseContentType
} from '@angular/http';
import { Injectable }    from '@angular/core';
import { Observable }    from 'rxjs/Observable';
import { Subject }       from 'rxjs/Subject';
import { CookieService } from 'ngx-cookie';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

import { User }    from '../user/user';
import { Globals } from '../globals';

@Injectable()
export class UserService {
  
  // Observable sources
  private onUserLogoutSource = new Subject<void>();
  private onDeliverableUserSource = new Subject<User>();

  // Observable streams
  onUserLogout$ = this.onUserLogoutSource.asObservable();
  onDeliverableUser$ = this.onDeliverableUserSource.asObservable();

  // User object
  private _user: User;
  
  get user(): User {
    return this._user || null;
  }
  
  baseApiUrl: string;
  
  constructor(private http: Http, private cookieService: CookieService) {
    this.baseApiUrl = Globals.baseApiUrl;

    this.getAuthUser().subscribe((user: User) => {
      this._user = user;
      this.onDeliverableUserSource.next(this._user);
    }, err => {
      this.onDeliverableUserSource.next(null);
      return this.handleError(err);
    });
  }

  /**
   * Returns an authenticated user based on an XSRF-TOKEN stored in cookies
   */
  getAuthUser(): Observable<User> {
    // Throw error if client browser does not have xsrf-token
    if (!this.cookieService.get('XSRF-TOKEN')) {
      return Observable.throw('missing xsrf-token');
    }

    // Get logged in user if XSRF-TOKEN is present
    return this.http.get(this.baseApiUrl + `/me?xsrf-token=${this.cookieService.get('XSRF-TOKEN')}`, {
      withCredentials: true
    })
    .map(res => {
      return User.initFromObject(res.json());
    })
    .catch(err => {
      return this.handleError(err);
    });
  }

  getUserAsync(uuid: string): Promise<any> {
    return this.http.get(this.baseApiUrl + '/user/' + uuid)
    .toPromise()
    .then(res => {
      return User.initFromObject(res.json());
    })
    .catch(this.handleError);
  }

  // Gets all users if client can authenticate using a JWT
  getUsersAsync(): Promise<any> {
    return this.http.get(this.baseApiUrl + '/user')
    .toPromise()
    .then(res => {
      let data = res.json();
      return data.map(User.initFromObject);
    })
    .catch(err => {
      this.handleError(err);
    });
  }

  updateUserAsync(user: User) {
    let params = user.toObject();
    delete params.uuid;
    if (user.role != 'systemAdmin' || user.role != 'admin') delete params.role;
    return this.http.put(this.baseApiUrl + '/user/' + user.uuid, params)
    .toPromise()
    .then(res => {
      let data = res.json();
      return User.initFromObject(data);
    })
    .catch(this.handleError);
  }

  uploadPhotoAsync(file) {
    let data = new FormData();
    data.append('profile', file);
    return this.http.post(this.baseApiUrl + '/user/photoUpload', data)
    .toPromise()
    .then(data => {
      return data;
    })
    .catch(this.handleError);
  }

  localLogin(username, password) {
    return this.http.post(this.baseApiUrl + '/auth/local', {
      username: username,
      password: password
    })
    .map(res => {
      let data = res.json();
      this._user = User.initFromObject(data);
      this.onDeliverableUserSource.next(this._user);
      return data;
    })
    .catch(this.handleError);
  }
  
  authenticateLinkedin() {
    window.location.href = this.baseApiUrl + '/auth/linkedin';
  }

  logoutUser(): Observable<any> {

    delete this._user;
    this.cookieService.removeAll();

    this.onUserLogoutSource.next();
    this.onDeliverableUserSource.next(null);

    return this.http.get(this.baseApiUrl + '/auth/logout')
    .map((res) => {
      return res.json();
    })
    .catch(this.handleError);
  }
  
  create(user: {firstname: string, lastname: string, email: string}, password: string): Observable<any> {
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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InV1aWQiOiI0YWFhZmI1Yy1hNmY3LTQ3ODktYjIzOS0xNTIxYjcwYTdlZWMiLCJsYXN0bmFtZSI6IkJsYWNrYnVybiIsImZpcnN0bmFtZSI6IkNyYWlnIiwicGljdHVyZVVybCI6Imh0dHA6Ly9yZXMuY2xvdWRpbmFyeS5jb20vc2hpbmdvL2ltYWdlL3VwbG9hZC92MTQxNDg3NDI0My9zaWxob3VldHRlX3Z6dWdlYy5wbmciLCJlbWFpbCI6ImNyYWlnLmJsYWNrYnVybkB1c3UuZWR1Iiwicm9sZSI6InN5c3RlbUFkbWluIiwicmVwdXRhdGlvbiI6MCwiYWNjb3VudElzQWN0aXZlIjp0cnVlLCJsYXN0TG9naW4iOiIyMDE3LTA2LTIxVDE3OjQ2OjA4LjQzMVoiLCJjcmVhdGVkQXQiOiIyMDE3LTA2LTIwVDIzOjU2OjUwLjE5MFoiLCJ1cGRhdGVkQXQiOiIyMDE3LTA2LTIxVDE3OjQzOjI1LjQ3MFoiLCJpc0FkbWluIjp0cnVlLCJuYW1lIjoiQ3JhaWcgQmxhY2tidXJuIn0sImlhdCI6MTQ5ODA2NzE2OCwiYXVkIjoidGVhY2hpbmdsZWFuLm9yZyJ9.iIbhk3CDBz6cnt9vP4uRE_TMNiICmdEV17nA_rsE2Ls

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InV1aWQiOiI0YWFhZmI1Yy1hNmY3LTQ3ODktYjIzOS0xNTIxYjcwYTdlZWMiLCJsYXN0bmFtZSI6IkJsYWNrYnVybiIsImZpcnN0bmFtZSI6IkNyYWlnIiwicGljdHVyZVVybCI6Imh0dHA6Ly9yZXMuY2xvdWRpbmFyeS5jb20vc2hpbmdvL2ltYWdlL3VwbG9hZC92MTQxNDg3NDI0My9zaWxob3VldHRlX3Z6dWdlYy5wbmciLCJlbWFpbCI6ImNyYWlnLmJsYWNrYnVybkB1c3UuZWR1Iiwicm9sZSI6InN5c3RlbUFkbWluIiwicmVwdXRhdGlvbiI6MCwiYWNjb3VudElzQWN0aXZlIjp0cnVlLCJsYXN0TG9naW4iOiIyMDE3LTA2LTIxVDE3OjQ2OjA4LjQzMVoiLCJjcmVhdGVkQXQiOiIyMDE3LTA2LTIwVDIzOjU2OjUwLjE5MFoiLCJ1cGRhdGVkQXQiOiIyMDE3LTA2LTIxVDE3OjQzOjI1LjQ3MFoiLCJpc0FkbWluIjp0cnVlLCJuYW1lIjoiQ3JhaWcgQmxhY2tidXJuIn0sImlhdCI6MTQ5ODA2NzE2OCwiYXVkIjoidGVhY2hpbmdsZWFuLm9yZyJ9.iIbhk3CDBz6cnt9vP4uRE_TMNiICmdEV17nA_rsE2Ls

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InV1aWQiOiI0YWFhZmI1Yy1hNmY3LTQ3ODktYjIzOS0xNTIxYjcwYTdlZWMiLCJsYXN0bmFtZSI6IkJsYWNrYnVybiIsImZpcnN0bmFtZSI6IkNyYWlnIiwicGljdHVyZVVybCI6Imh0dHA6Ly9yZXMuY2xvdWRpbmFyeS5jb20vc2hpbmdvL2ltYWdlL3VwbG9hZC92MTQxNDg3NDI0My9zaWxob3VldHRlX3Z6dWdlYy5wbmciLCJlbWFpbCI6ImNyYWlnLmJsYWNrYnVybkB1c3UuZWR1Iiwicm9sZSI6InN5c3RlbUFkbWluIiwicmVwdXRhdGlvbiI6MCwiYWNjb3VudElzQWN0aXZlIjp0cnVlLCJsYXN0TG9naW4iOiIyMDE3LTA2LTIxVDE3OjA2OjExLjg1NloiLCJjcmVhdGVkQXQiOiIyMDE3LTA2LTIwVDIzOjU2OjUwLjE5MFoiLCJ1cGRhdGVkQXQiOiIyMDE3LTA2LTIxVDE3OjA2OjExLjk2NFoiLCJpc0FkbWluIjp0cnVlLCJuYW1lIjoiQ3JhaWcgQmxhY2tidXJuIn0sImlhdCI6MTQ5ODA2NDc5MCwiYXVkIjoidGVhY2hpbmdsZWFuLm9yZyJ9.aXRsXmiC-8SKHRHHIv1gANfXM-4Nd0aH4c1fmaCZx4U