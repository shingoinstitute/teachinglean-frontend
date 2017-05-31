import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
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

import { ForumService } from '../services/forum.service';
import { UserService } from '../services/user.service';
import { Entry } from "../entry/entry";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit, AfterViewInit {

  topResults: Entry[] = [];
  recentQuestions: Entry[] = [];

  questionFormEnabled = false;

  constructor(
    private forumService: ForumService,
    private userService: UserService,
    private http: Http,
    private router: Router) {

    this.questionFormEnabled = userService.user != null;

  }

  ngOnInit() {
    this.forumService.requestAllQuestions().subscribe(
      data => { 
        this.recentQuestions = data.map(Entry.initFromObject); 
      },
      err => { console.log(err); }
    );

    this.forumService.requestTopQuestions()
    .subscribe(
      data => {
        this.topResults = data.map(Entry.initFromObject);
      },
      err => { console.error(err); }
    )
  }

  ngAfterViewInit() {
  }

  navigateToEntry(entryId: string) {
    this.router.navigate(['forum', entryId]);
  }

  onClickSubmitQuestionHandler(question: { title: string, content: string }) {
    this.forumService.createEntry({
      owner: this.userService.user.uuid,
      title: question.title,
      content: question.content,
      parent: null
    })
    .subscribe(entry => console.log(entry), error => console.log(error));
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
