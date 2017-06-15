import { 
  Component, 
  AfterViewInit,
  OnDestroy, 
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { UserService } from "../services/user.service";
import { ForumService } from '../services/forum.service';
import { User } from "../user/user";
import { Entry } from '../entry/entry';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  spinnerEnabled = true;
  selectedDashboardTab = 0;
  user: User;
  recent: Entry[] = [];
  questions: Entry[] = [];
  answers: Entry[] = [];
  comments: Entry[] = [];

  constructor(private userService: UserService, private router: Router, private forum: ForumService, private cookies: CookieService) {}

  ngOnInit() {
    // Set dashboard tab from cookies
    this.selectedDashboardTab = +this.cookies.get('selectedDashboardTab') || 0;
    
    this.user = this.userService.user;
    this.userService.getAuthUser().subscribe(user => {
      this.user = user;
      this.loadRecentActivity();
    }, err => {
      console.error(err + ', please sign in.');
      this.router.navigate(['login']);
    });

    this.user && this.loadRecentActivity();
  }

  loadRecentActivity() {
    this.spinnerEnabled = false;
    this.forum.requestRecent(10, this.user.uuid)
    .subscribe(data => { 
      this.recent = data.map(Entry.initFromObject); this.loadQuestions(); 
    });
  }

  loadQuestions() {
    this.forum.requestUserQuestions(this.user.uuid)
    .subscribe(data => {
      this.questions = data.map(Entry.initFromObject); this.loadAnswers(); 
    });
  }

  loadAnswers() {
    this.forum.requestUserAnswers(this.user.uuid)
    .subscribe(data => {
      this.answers = data.map(Entry.initFromObject); this.loadComments();
    });
  }

  loadComments() {
    this.forum.requestUserComments(this.user.uuid)
    .subscribe(data => {
      this.comments = data.map(Entry.initFromObject) ;
    });
  }

  onclickMainTabGroup(e) {
    // selected tab from main tab group
    this.cookies.put('selectedDashboardTab', `${e.index}`);
  }

}
