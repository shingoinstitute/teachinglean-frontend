import { Injectable } from '@angular/core';
import {Http, Response, ResponseContentType} from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Globals } from '../globals';

class Entry {
  owner: string;
  uuid: string;
}

@Injectable()
export class ForumService {

  constructor(private http: Http, private baseUrl: string) {
    this.baseUrl = Globals.baseApiUrl;
  }

  getUserQuestions(uuid): Observable<Entry[]> {
    let url = this.baseUrl + '/entry?where={"owner": "' + uuid + '","parent":null}&populate=owner';
    return this.http.get(url, {responseType: ResponseContentType.Json})
               .map(this.handleResponse)
               .catch(this.handleError);
  }

  getUserAnswers(uuid): Observable<Entry[]> {
    let url = this.baseUrl + '/entry?where={"owner":"' + uuid + '","parent": {"!":null}}&populate=owner';
    return this.http.get(url, {responseType: ResponseContentType.Json})
               .map(this.handleResponse)
               .catch(this.handleError);
  }

  getUserComments(uuid): Observable<Entry[]> {
    let url = this.baseUrl + '/comment?where={"owner":"' + uuid + '"}&populate=owner,parent';
    return this.http.get(url, {responseType: ResponseContentType.Json})
      .map(this.handleResponse)
      .catch(this.handleError);
  }

  getQuestions(): Observable<Entry[]> {
    let url = this.baseUrl + '/entry?where={"parent":null}&populate=owner,parent';
    return this.http.get(url, {responseType: ResponseContentType.Json})
      .map(this.handleResponse)
      .catch(this.handleError);
  }

  getAnswers(): Observable<Entry[]> {
    let url = this.baseUrl + '/entry?where={"parent": {"!":null}}&populate=owner,parent';
    return this.http.get(url, {responseType: ResponseContentType.Json})
      .map(this.handleResponse)
      .catch(this.handleError);
  }

  getComments(): Observable<Entry[]> {
    let url = this.baseUrl + '/comment?populate=owner,parent';
    return this.http.get(url, {responseType: ResponseContentType.Json})
      .map(this.handleResponse)
      .catch(this.handleError);
  }

  getRecent(limit, userId) {
    // let now = Date.now();
    // let recent = now.subtract(10, 'days');
    // let params = {
    //   createdAt: {
    //     ">": recent.toJSON()
    //   },
    //   parent: null,
    //   owner: userId,
    // }
    // let url = '/entry?where=' + JSON.stringify(params) + (limit ? '&limit=' + limit : '');
    // return $http({
    //   method: 'get',
    //   dataType: 'json',
    //   url: url
    // });
  }

  readEntry(id) {
    // return $http({
    //   method: 'get',
    //   dataType: 'json',
    //   url: '/entry/' + id + '?populate=answers,owner,comments,parent,users_did_upvote,users_did_downvote'
    // });
  }

  readComment(id) {
    // return $http({
    //   method: 'get',
    //   dataType: 'json',
    //   url: '/comment/' + id + '?populate=owner,parent'
    // });
  }

  createEntry(entry) {
    // return $http({
    //   method: 'post',
    //   dataType: 'json',
    //   url: '/entry',
    //   data: entry
    // });
  }

  destroyEntry(entry) {
    // return $http({
    //   method: 'delete',
    //   dataType: 'json',
    //   url: '/entry',
    //   data: entry
    // });
  }

  destroyComment(comm) {
    // return $http({
    //   method: 'delete',
    //   dataType: 'json',
    //   url: '/comment',
    //   data: comm
    // });
  }

  createComment(comment) {
    // return $http({
    //   method: 'post',
    //   dataType: 'json',
    //   url: '/comment',
    //   data: comment
    // });
  }

  save(entry) {
    // return $http({
    //   method: 'put',
    //   dataType: 'json',
    //   url: '/entry/' + entry.id,
    //   data: entry
    // });
  }

  saveComment(comment) {
    // return $http({
    //   method: 'put',
    //   dataType: 'json',
    //   url: '/comment/' + comment.id,
    //   data: comment
    // });
  }

  upvoteEntry(entry) {
    // return $http.put('/entry/upvote/' + entry.id);
  }

  downvoteEntry(entry) {
    // return $http.put('/entry/downvote/' + entry.id);
  }

  query(queryString) {
    // let query = {
    //   'or': [{
    //     'title': {
    //       'like': "%25" + queryString + "%25"
    //     },
    //   },
    //     {
    //       'content': {
    //         'like': "%25" + queryString + "%25"
    //       }
    //     }
    //   ]
    // };
    // let url = '/entry?where=' + JSON.stringify(query) + '&populate=owner';
    // return $http({
    //   method: 'get',
    //   dataType: 'json',
    //   url: url
    // })
  }

  private handleResponse(response: Response) {
    let body = response.json();
    return body.data || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }


}
