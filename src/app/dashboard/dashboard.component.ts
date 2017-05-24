import { 
  Component, 
  AfterViewInit,
  OnDestroy, 
  OnInit 
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { UserService } from "../services/user.service";
import { ForumService } from '../services/forum.service';
import { User } from "../user/user";
import { Entry } from '../entry/entry';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {

  spinnerEnabled = true;

  user: User;
  recent: Entry[] = [];
  questions: Entry[] = [];
  answers: Entry[] = [];
  comments: Entry[] = [];

  constructor(private userService: UserService, private router: Router, private forum: ForumService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!this.user) {
      this.userService.pokeUserAsync()
      .then(user => this.onLoadUser(user))
      .catch(this.onError);
    } else {
      this.loadRecentActivity();
    }
  }

  onLoadUser(user: User) {
    this.spinnerEnabled = false;
    this.user = user;
    this.loadRecentActivity();
  }

  loadRecentActivity() {
    this.forum.requestRecent(10, this.user.uuid)
    .subscribe(
      data => { this.recent = data.map(Entry.initFromObject); this.loadQuestions(); }
    )
  }

  loadQuestions() {
    this.forum.requestUserQuestions(this.user.uuid)
    .subscribe(
      data => { this.questions = data.map(Entry.initFromObject); this.loadAnswers(); }
    )
  }

  loadAnswers() {
    this.forum.requestUserAnswers(this.user.uuid)
    .subscribe(
      data => { this.answers = data.map(Entry.initFromObject); this.loadComments(); }
    )
  }

  loadComments() {
    this.forum.requestUserComments(this.user.uuid)
    .subscribe(
      data => { this.comments = data.map(Entry.initFromObject) }
    )
  }

  onError(error) {
    console.error(error);
    this.router.navigate(['login']);
  }

}
