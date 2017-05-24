import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Globals } from '../globals';
import { Entry } from '../entry/entry';

@Injectable()
export class ForumService {

  private baseUrl;

  entry: any;

  constructor(private http: Http) {
    this.baseUrl = Globals.baseApiUrl;
  }

  requestUserQuestions(uuid): Observable<Entry[]> {
    let url = this.baseUrl + '/entry?where={"owner": "' + uuid + '","parent":null}&populate=owner';
    return this.getRequestHandler(url);
  }

  requestUserAnswers(uuid): Observable<Entry[]> {
    let url = this.baseUrl + '/entry?where={"owner":"' + uuid + '","parent": {"!":null}}&populate=owner';
    return this.getRequestHandler(url);
  }

  requestUserComments(uuid): Observable<Entry[]> {
    let url = this.baseUrl + '/comment?where={"owner":"' + uuid + '"}&populate=owner,parent';
    return this.getRequestHandler(url);
  }

  requestQuestions(): Observable<Entry[]> {
    let url = this.baseUrl + '/entry?where={"parent":null}&populate=owner,parent';
    return this.getRequestHandler(url);
  }

  requestAnswers(): Observable<Entry[]> {
    let url = this.baseUrl + '/entry?where={"parent": {"!":null}}&populate=owner,parent';
    return this.getRequestHandler(url);
  }

  requestComments(): Observable<Entry[]> {
    let url = this.baseUrl + '/comment?populate=owner,parent';
    return this.getRequestHandler(url);
  }

  requestRecent(limit, userId) {
    let params = {
      createdAt: {
        ">": new Date(Date.now() - (10 * 24 * 60 * 60 * 1000))
      },
      parent: null,
      owner: userId,
    };
    let url = this.baseUrl + '/entry?where=' + JSON.stringify(params) + (limit ? '&limit=' + limit : '');
    return this.getRequestHandler(url);
  }

  requestAllQuestions(): Observable<any> {
    let params = {
      parent: null
    };
    let url = this.baseUrl + '/entry?where=' + JSON.stringify(params) + '&limit=10';
    return this.getRequestHandler(url);
  }

  requestTopQuestions(): Observable<any> {
    let url = this.baseUrl + '/entry/topResults';
    return this.getRequestHandler(url);
  }

  requestEntry(id: string) {
    let url = this.baseUrl + '/entry/' + id;
    return this.getRequestHandler(url);
  }

  getEntry(id: string) {
    return this.http.get(this.baseUrl + '/entry/' + id + '?populate=answers,owner,comments,parent,users_did_upvote,users_did_downvote')
      .map(res => res.json())
      .catch(this.handleError);
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

  createEntry(entry: {content: any, owner: any, parent: any, title: any}) {
    return this.http.post(this.baseUrl + '/entry', entry, {
      responseType: ResponseContentType.Json
    })
    .map(response => {
      return response.json();
    })
    .catch(this.handleError);
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

  markIncorrect(entryId: string) {
    return this.markCorrect(entryId, false);
  }

  markCorrect(entryId: string, isCorrect: boolean = true) {
    return this.http.put(this.baseUrl + '/entry/' + entryId, {markedCorrect: isCorrect}, { responseType: ResponseContentType.Json })
    .map(this.handleResponse)
    .catch(this.handleError)
  }

  private getRequestHandler(url) {
    return this.http.get(url, { responseType: ResponseContentType.Json })
    .map(this.handleResponse)
    .catch(this.handleError);
  }

  private handleResponse(response: Response): Object {
    let data = response.json();
    return data || {};
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

  static extractEntries(raw: {}[]) {
    let entries: Entry[] = [];
    for (let i in raw) {
      entries.push(Entry.initFromObject(raw[i]));
    }
    return entries;
  }

}
