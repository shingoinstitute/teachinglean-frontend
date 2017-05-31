import {
  Http, 
  Response, 
  ResponseContentType
} from '@angular/http';
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
  private userStatusChangeNotiferSource = new Subject<boolean>();
  private onDeliverableUserSource = new Subject<User>();

  // Observable streams
  userStatusChangeNotifier$ = this.userStatusChangeNotiferSource.asObservable();
  onDeliverableUser$ = this.onDeliverableUserSource.asObservable();
  
  onUserDidChangeStatus(userDidLogin: boolean) {
    this.userStatusChangeNotiferSource.next(userDidLogin);
  }

  // User object
  private _user: User;
  
  get user(): User {
    return this._user || null;
  }
  
  baseApiUrl: string;
  
  constructor(private http: Http, private cookieService: CookieService) {
    this.baseApiUrl = Globals.baseApiUrl;

    // Get logged in user if XSRF-TOKEN is present
    if (!this.cookieService.get('XSRF-TOKEN')) {
      this.http.get(this.baseApiUrl + '/me').subscribe(res => {
        this._user = User.initFromObject(res.json());
        this.onDeliverableUserSource.next(this._user);
      });
    }
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
      console.log('adsfjildsajfkl');
      this.handleError(err);
    });
  }

  updateUser(user: User) {
    return this.http.put(this.baseApiUrl + '/user/' + user.uuid, user.toObject())
    .toPromise()
    .then(res => {
      let data = res.json();
      return data.map(User.initFromObject)
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
      return data;
    })
    .catch(this.handleError);
  }
  
  logoutUser(): Observable<any> {

    delete this._user;
    this.cookieService.removeAll();

    return this.http.get(this.baseApiUrl + '/auth/logout')
    .map((res) => {
      return res.json();
    })
    .catch(this.handleError)
    .finally(() => {
      this.userStatusChangeNotiferSource.next(false);
    });
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
