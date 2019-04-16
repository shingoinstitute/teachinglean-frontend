
import {throwError as observableThrowError,  Observable ,  Subject ,  Subscription ,  Observer } from 'rxjs';

import {catchError, map, debounceTime} from 'rxjs/operators';
import { Injectable }     from '@angular/core';
import {
  Http, 
  Response, 
  ResponseContentType
} from '@angular/http';
import { CookieService }  from 'ngx-cookie';
import { User }           from '../user/user';
import { Globals }        from '../globals';
import { environment }    from '../../environments/environment';




@Injectable()
export class UserService {
  
  private onUserLogoutSource = new Subject<void>();
  private onDeliverableUserSource = new Subject<User>();

  private readonly cookieDomain = "teachinglean.org";
  private readonly cookieOptions = {
    withCredentials: true,
    domain: this.cookieDomain
  };

  onUserLogout$ = this.onUserLogoutSource.asObservable();
  onDeliverableUser$ = this.onDeliverableUserSource.asObservable();

  private _user: User | null;
  get user(): User { return this._user; }
  set user(val: User) {
    this._user = val;
    this.onDeliverableUserSource.next(val);
  }

  get csrfToken(): string { return this.cookieService.get('XSRF-TOKEN'); }
  set csrfToken(token: string) { 
    this.cookieService.put('XSRF-TOKEN', token, this.cookieOptions);
  }

  baseApiUrl: string = Globals.baseApiUrl;
  
  constructor(private http: Http, private cookieService: CookieService) {
    this.getAuthenticatedUser().subscribe(user => {
      this.user = user;
    }, err => {
      console.error(err);
    });
  }

  /**
   * @description Makes an api request to get the currently authenticated user based 
   * on a CSRF token and sets `this.user` on a successful request.
   */
  getAuthenticatedUser(): Observable<User> {
    const token = this.csrfToken || "";
    return this.http.get(`${this.baseApiUrl}/me?xsrf-token=${token}`).pipe(
    debounceTime(500),
    map((res: Response) => {
      const data = res.json();
      this.user = User.initFromObject(data);
      return this.user;
    }),
    catchError(this.handleError),)
  }

  // Gets a single user given the requesting user is authenticated
  getUser(uuid: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/user/${uuid}`).pipe(
    map(res => {
      return User.initFromObject(res.json());
    }),
    catchError(this.handleError),);
  }

  /**
   * Gets all users if the requesting user is authenticated
   * @param limit :: the max number of users to retrieve
   * @param page :: the number of records to skip, calculated by `page * limit`
   */
  getUsers(limit?: number, page?: number): Observable<any> {
    let size = 300;
    let skip = (page - 1) * limit;
    let url = `${this.baseApiUrl}/user?where={sort:'lastname'}` + (limit && page ? `&limit=${limit}&skip=${page*limit}` : '');
    return this.http.get(url).pipe(
    map(res => {
      let data = res.json();
      return data;
    }),
    catchError(this.handleError),);
  }

  updateUser(user: User) {
    let params = user.toObject();
    delete params.uuid;
    if (user.role != 'systemAdmin' || user.role != 'admin') delete params.role;
    return this.http.put(`${this.baseApiUrl}/user/${user.uuid}`, params).pipe(
    map(res => {
      let data = res.json();
      return User.initFromObject(data);
    }),
    catchError(this.handleError),);
  }

  uploadPhotoAsync(file): Observable<any> {
    if (!this.user) {
      return observableThrowError('user must be logged in to upload profile picture.');
    }
    return Observable.create(observer => {
      let data = new FormData();
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      data.append('profile', file, `${this.user.uuid}`);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      }

      xhr.open('POST', `${this.baseApiUrl}/user/photoUpload`, true);
      xhr.send(data);
    });
  }

  localLogin(username, password) {
    return this.http.post(`${this.baseApiUrl}/auth/local`, {
      username: username,
      password: password
    }).pipe(
    map(res => {
      let data = res.json();
      this.csrfToken = data['xsrf-token'];
      this.user = User.initFromObject(data);
      return data;
    }),
    catchError(err => {
      let errMsg;
      if (err instanceof Response) {
        let body = err.json();
        errMsg = body.error || JSON.stringify(body);
      } else {
        errMsg = err.error;
      }
      return observableThrowError(errMsg);
    }),);
  }
  
  authenticateLinkedin() {
    window.location.href = `${this.baseApiUrl}/auth/linkedin`;
  }

  logoutUser(): Observable<void> {
    delete this.user;
    this.onUserLogoutSource.next(null);

    return this.http.get(`${this.baseApiUrl}/auth/logout`).pipe(
    map((res) => {
      console.log("Removing COOKIE!");
      this.cookieService.remove("XSRF-TOKEN", {
        domain: this.cookieDomain
      });
      console.log(res.json());
      return;
    }),
    catchError(this.handleError),);
  }
  
  create(user: {firstname: string, lastname: string, email: string, username: string}, password: string): Observable<any> {
    this.cookieService.remove("XSRF-TOKEN", {
        domain: this.cookieDomain
      });
    return this.http.post(`${this.baseApiUrl}/user`, {
      email: user.email,
      password: password,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username
    }, {
      responseType: ResponseContentType.Json
    }).pipe(
    map(res => {
      let data = res.json();
      return User.initFromObject(data.user);
    }),
    catchError(this.handleError),);
  }

  checkEmailCollisions(email: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/emailDoesExist?email=${email}`).pipe(
    map(res => {
      return res.json();
    }),
    catchError(this.handleError),);
  }

  checkUsernameCollisions(username: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/usernameDoesExist?username=${username}`).pipe(
    map(res => {
      return res.json();
    }),
    catchError(this.handleError),);
  }

  sendPasswordResetLink(email: string) {
    return this.http.post(`${this.baseApiUrl}/reset`, {
      email: email
    }).pipe(
    map(res => {
      return res.json();
    }),
    catchError(this.handleError),);
  }

  updatePassword(password: string, id: string, token: string): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/reset/${id}`, {
      password: password,
      token: token
    }).pipe(
    map(res => {
      return res.json();
    }),
    catchError(this.handleError),)
  }

  /**
   * @description :: Gets user stats from server including
   * size, number active, number disabled/inactive, number 
   * of admins, moderators, authors, editors, members, and
   * number of users with verified emails.
   */
  getStats(): Observable<any> {
    let url = `${this.baseApiUrl}/user/stats`;
    return this.http.get(url).pipe(
    map(res => {
      return res.json();
    }),
    catchError(this.handleError),);
  }
  
  private handleError(error: Response | any) {
    let err: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      err = body.error || JSON.stringify(body);
    } else {
      err = error.message ? error.message : error.toString();
    }
    return observableThrowError(err);
  }
  
}