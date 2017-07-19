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

  baseUrl: string;

  entry: Entry;

  constructor(public http: Http) {
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

  getEntryParent(id: string): Observable<Entry> {
    return this.http.get(this.baseUrl + '/entry/' + id + '?populate=parent')
    .map(res => {
      let data = res.json();
      return Entry.initFromObject(data);
    })
    .catch(this.handleError);
  }

  updateEntry(entry: Entry) {
    return this.http.put(this.baseUrl + '/entry/' + entry.id, {
      content: entry.content,
      title: entry.title
    })
    .map(res => res.json())
    .catch(this.handleError);
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

  destroyEntry(entryId: string) {
    return this.http.delete(this.baseUrl + '/entry/' + entryId, {
      responseType: ResponseContentType.Json
    })
    .map(res => {
      return res.json();
    })
    .catch(this.handleError);
  }

  destroyComment(commId: string) {
    return this.http.delete(this.baseUrl + '/comment/' + commId, {
      responseType: ResponseContentType.Json
    })
    .map(res => {
      return res.json();
    })
    .catch(this.handleError);
  }

  createComment(comment: { parent: string, owner: string, content: string }) {
    return this.http.post(this.baseUrl + '/comment', comment)
    .map(res => {
      return res.json();
    })
    .catch(this.handleError);
  }
    
  setIsCorrect(entry: Entry): Observable<Entry> {
    return this.http.put(`${this.baseUrl}/entry/${entry.id}/accept`, { accepted: entry.markedCorrect }, { responseType: ResponseContentType.Json })
      .map(res => {
        return Entry.initFromObject(res.json());
      }).catch(this.handleError);
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

  private handleError(err: Response | any) {
    let errMsg: string;
    if (!err) 
      return Observable.throw("The request could not be complete, and unkown error occured.");

    if (err instanceof Response) {
      const body = err.json();
      if (body)
        return Observable.throw(body.error || JSON.stringify(body));
      else
        return Observable.throw(`Status ${err.status} ${err.statusText}`);
    }  

    if (err && err.message)
      errMsg = err.message;
    else if (err && err.toString)
      errMsg = err.toString;
    else
      errMsg = "Unknown error occured..."; 

    return Observable.throw(errMsg);
  }

}
