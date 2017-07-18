import { Injectable }     from '@angular/core';
import {
  Http, 
  Response, 
  ResponseContentType
} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Subject }        from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';
import { Observer }       from 'rxjs/Observer';
import { CookieService }  from 'ngx-cookie';
import { User }           from '../user/user';
import { Globals }        from '../globals';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  
  private onUserLogoutSource = new Subject<void>();
  private onDeliverableUserSource = new Subject<User>();

  onUserLogout$ = this.onUserLogoutSource.asObservable();
  onDeliverableUser$ = this.onDeliverableUserSource.asObservable();

  private _user: User | null;
  get user(): User { return this._user; }
  set user(val: User) {
    this._user = val;
    this.onDeliverableUserSource.next(val);
  }

  get csrfToken(): string { return this.cookieService.get('XSRF-TOKEN'); }
  set csrfToken(token: string) { this.cookieService.put('XSRF-TOKEN', token); }

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
    return this.http.get(`${this.baseApiUrl}/me?xsrf-token=${token}`)
    .debounceTime(500)
    .map((res: Response) => {
      const data = res.json();
      this.user = User.initFromObject(data);
      return this.user;
    })
    .catch(this.handleError)
  }

  // Gets a single user given the requesting user is authenticated
  getUser(uuid: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/user/${uuid}`)
    .map(res => {
      return User.initFromObject(res.json());
    })
    .catch(this.handleError);
  }

  /**
   * Gets all users if the requesting user is authenticated
   * @param limit :: the max number of users to retrieve
   * @param page :: the number of records to skip, calculated by `page * limit`
   */
  getUsers(limit?: number, page?: number, dev?: boolean): Observable<any> {
    let size = 300;
    let skip = (page - 1) * limit;
    let url = dev ? `http://localhost:3000/backend/user/randUsers?limit=${limit}&skip=${skip}&size=${size}` : `${this.baseApiUrl}/user?where={sort:'lastname'}` + (limit && page ? `&limit=${limit}&skip=${page*limit}` : '');
    return this.http.get(url)
    .map(res => {
      let data = res.json();
      return dev ? data.users : data;
    })
    .catch(this.handleError);
  }

  updateUser(user: User) {
    let params = user.toObject();
    delete params.uuid;
    if (user.role != 'systemAdmin' || user.role != 'admin') delete params.role;
    return this.http.put(`${this.baseApiUrl}/user/${user.uuid}`, params)
    .map(res => {
      let data = res.json();
      return User.initFromObject(data);
    })
    .catch(this.handleError);
  }

  uploadPhotoAsync(file): Observable<any> {
    if (!this.user) {
      return Observable.throw('user must be logged in to upload profile picture.');
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
    })
    .map(res => {
      let data = res.json();
      this.csrfToken = data['xsrf-token'];
      this.user = User.initFromObject(data);
      return data;
    })
    .catch(err => {
      let errMsg;
      if (err instanceof Response) {
        let body = err.json();
        errMsg = body.error || JSON.stringify(body);
      } else {
        errMsg = err.error;
      }
      return Observable.throw(errMsg);
    });
  }
  
  authenticateLinkedin() {
    window.location.href = `${this.baseApiUrl}/auth/linkedin`;
  }

  logoutUser(): Observable<void> {
    delete this.user;
    this.cookieService.removeAll();
    this.onUserLogoutSource.next(null);

    return this.http.get(`${this.baseApiUrl}/auth/logout`)
    .map((res) => {
      console.log(res.json());
      return;
    })
    .catch(this.handleError);
  }
  
  create(user: {firstname: string, lastname: string, email: string, username: string}, password: string): Observable<any> {
    this.cookieService.removeAll();
    return this.http.post(`${this.baseApiUrl}/user`, {
      email: user.email,
      password: password,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username
    }, {
      responseType: ResponseContentType.Json
    })
    .map(res => {
      let data = res.json();
      return User.initFromObject(data.user);
    })
    .catch(this.handleError);
  }

  checkEmailCollisions(email: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/emailDoesExist?email=${email}`)
    .map(res => {
      return res.json();
    })
    .catch(this.handleError);
  }

  checkUsernameCollisions(username: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/usernameDoesExist?username=${username}`)
    .map(res => {
      return res.json();
    })
    .catch(this.handleError);
  }

  sendPasswordResetLink(email: string) {
    return this.http.post(`${this.baseApiUrl}/reset`, {
      email: email
    })
    .map(res => {
      return res.json();
    })
    .catch(this.handleError);
  }

  updatePassword(password: string, id: string, token: string): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/reset/${id}`, {
      password: password,
      token: token
    })
    .map(res => {
      return res.json();
    })
    .catch(this.handleError)
  }

  /**
   * @description :: Gets user stats from server including
   * size, number active, number disabled/inactive, number 
   * of admins, moderators, authors, editors, members, and
   * number of users with verified emails.
   */
  getStats(dev?: boolean): Observable<any> {
    let url = dev ? `${this.baseApiUrl}/dev/user/stats` : `${this.baseApiUrl}/user/stats`;
    return this.http.get(url)
    .map(res => {
      return res.json();
    })
    .catch(this.handleError);
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