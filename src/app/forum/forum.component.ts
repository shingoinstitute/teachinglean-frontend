import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { MdIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Http, Response, ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../services/user.service';
import { Entry } from "./entry";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  animations: [
    trigger('shrinkGrow', [
      state('active', style({transform: 'translateX(0)', height: 'auto'})),
      state('inactive', style({transform: 'translateX(200%)', height: '0'})),
      transition('inactive => active', [
        style({transform: 'translateX(200%)'}),
        animate(200)
      ]),
      transition('active => inactive', [
        animate(200, style({transform: 'translateX(200%)'}))
      ])
    ])
  ]

})
export class ForumComponent implements OnInit, AfterViewInit {

  topResults: Entry[] = [];
  recentQuestions: Entry[] = [];

  questionDialogState = "inactive";

  questionFormEnabled: boolean;

  constructor(
    private forumService: ForumService,
    private userService: UserService,
    private http: Http,
    private router: Router) {

    userService.userStatusChangeNotifier$.subscribe(
      (userIsLogged) => {
        this.questionFormEnabled = userIsLogged;
      }
    );

  }

  ngOnInit() {
    this.forumService.requestAll().subscribe(
      data => { this.onLoadRecentComplete(data) },
      err => { console.log(err); }
    );
  }

  ngAfterViewInit() {
  }

  onLoadRecentComplete(data) {
    // TODO :: Rewrite function to return recent questions instead of ALL questions; Get rid of http service.
    let entries: Entry[] = [];
    for (let element of data) {
      entries.push(Entry.initFromObject(element));
    }
    this.recentQuestions = entries;
  }

  navigateToEntry(entryId: string) {
    this.router.navigate(['forum', entryId]);
  }

  onClickAskQuestion() {
    let state = this.questionDialogState;
    this.questionDialogState = state === "inactive" ? "active" : "inactive";
  }

  onClickPostQuestionHandler(question: { title: string, content: string }) {
    let entry = Entry.initFromObject({
      owner: this.userService.user.uuid,
      title: question.title,
      content: question.content,
      parent: null
    });
    
    this.forumService.createEntry(entry)
      .subscribe(
        entry => console.log(entry),
        error => console.log(error)
      );
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
