
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { 
  Component, 
  ViewChild,
  OnInit
} from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { UserService } from "../services/user.service";
import { ForumService } from '../services/forum.service';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component'
import { ModeratorComponent } from '../moderator/moderator.component';
import { User } from "../user/user";
import { Entry } from '../entry/entry';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(AdminPanelComponent) adminPanel: AdminPanelComponent;
  @ViewChild(ModeratorComponent) moderatorPanel: ModeratorComponent;

  spinnerEnabled = true;
  selectedDashboardTab = 0;
  user: User;
  recent: Entry[] = [];
  questions: Entry[] = [];
  answers: Entry[] = [];
  comments: Entry[] = [];

  constructor(
    private userService: UserService, 
    private forum: ForumService, 
    private cookies: CookieService,
    private router: Router) {}

  ngOnInit() {
    this.findUser().subscribe(user => {
      // Set user variable
      this.user = user;

      // Load recent activity
      this.loadRecentActivity();

      // Get last selected dashboard tab from cookies
      this.selectedDashboardTab = +this.cookies.get('selectedDashboardTab') || 0;
    }, err => {
      // Ignore error
      this.router.navigateByUrl('/login');
    });
  }

  findUser(): Observable<User> {
    const observables = [
      Observable.create(observer => {
        observer.next(this.userService.user);
      }),
      this.userService.getAuthenticatedUser()
    ];

    return Observable.merge(...observables)
    .filter(user => {
      return user instanceof User;
    })
    .take(1)
    .catch(err => {
      return observableThrowError(err);
    });
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
    let index = e.index;
    // selected tab from main tab group
    this.cookies.put('selectedDashboardTab', `${index}`);
    if (this.adminPanel && index === 2) {
      // console.log('loading admin data.');
      // this.adminPanel.loadData();
    } else if (this.moderatorPanel && index == 3) {
      this.moderatorPanel.loadData()
    }
  }

}
