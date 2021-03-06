import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { UserService } from '../services/user.service';
import { Entry } from "../entry/entry";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  topResults: Entry[] = [];
  recentQuestions: Entry[] = [];

  questionFormEnabled = false;

  constructor(
    private forumService: ForumService,
    private userService: UserService,
    private router: Router) {

    this.questionFormEnabled = this.userService.user != null;
    this.userService.onDeliverableUser$.subscribe(user => {
      this.questionFormEnabled = !!user;
    }, err => {
      console.log(err);
    });

    this.userService.onUserLogout$.subscribe(() => {
      this.questionFormEnabled = false;
    });
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

  navigateToEntry(entryId: string) {
    this.router.navigate(['forum', entryId]);
  }

}
