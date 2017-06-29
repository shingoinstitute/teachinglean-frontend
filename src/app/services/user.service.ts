import {
  Http, 
  Response, 
  ResponseContentType
} from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable }     from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Subject }        from 'rxjs/Subject';
import { CookieService }  from 'ngx-cookie';
import { User }           from '../user/user';
import { Globals }        from '../globals';
import { environment }    from '../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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
  
  constructor(private http: Http, private cookieService: CookieService, private route: ActivatedRoute) {
    this.baseApiUrl = Globals.baseApiUrl;
    this.getAuthUser().subscribe({
      error: (err) => {}
    });
  }

  /**
   * Returns an authenticated user based on an XSRF-TOKEN stored in cookies or provided in args
   */
  getAuthUser(token?: string): Observable<User> {
    if (token) {
      this.cookieService.put('XSRF-TOKEN', token);
    } else {
      token = this.cookieService.get('XSRF-TOKEN') || null;
    }

    // Throw error if client browser does not have xsrf-token
    if (!token) {
      return Observable.throw('missing xsrf-token');
    }

    // Get logged in user if XSRF-TOKEN is present
    return this.http.get(`${this.baseApiUrl}/me?xsrf-token=${token}`)
    .map(res => {
      let user = User.initFromObject(res.json());
      this._user = user;
      this.onDeliverableUserSource.next(this._user);
      return user;
    })
    .catch(this.handleError);
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
  getUsers(limit?: number, page?: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/user?where={sort:'lastname'}` + (limit && page ? `&limit=${limit}&skip=${page*limit}` : ''))
    .map(res => {
      return res.json()
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
      this.cookieService.put('XSRF-TOKEN', data['xsrf-token']);
      this._user = User.initFromObject(data);
      this.onDeliverableUserSource.next(this._user);
      return data;
    })
    .catch(this.handleError);
  }
  
  authenticateLinkedin() {
    window.location.href = `${this.baseApiUrl}/auth/linkedin`;
  }

  logoutUser(): Observable<any> {

    delete this._user;
    this.cookieService.removeAll();

    this.onUserLogoutSource.next();
    this.onDeliverableUserSource.next(null);

    return this.http.get(`${this.baseApiUrl}/auth/logout`)
    .map((res) => {
      return res.json();
    })
    .catch(this.handleError);
  }
  
  create(user: {firstname: string, lastname: string, email: string}, password: string): Observable<any> {
    this.cookieService.removeAll();
    return this.http.post(`${this.baseApiUrl}/user`, {
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
  getStats(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/user/stats`)
    .map(res => {
      return res.json();
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