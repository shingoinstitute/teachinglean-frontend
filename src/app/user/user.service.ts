import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User } from './user';

@Injectable()
export class UserService {

    private baseUri = 'http://localhost:8080/backend';

    constructor(private http: Http) { }

    getUser(): Observable<User> {
        return this.http.get(this.baseUri + '/me')
            .map(this.extractData)
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
