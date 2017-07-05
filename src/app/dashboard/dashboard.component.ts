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

  constructor(private userService: UserService, private forum: ForumService, private cookies: CookieService) {}

  ngOnInit() {
    // Set dashboard tab from cookies
    this.selectedDashboardTab = +this.cookies.get('selectedDashboardTab') || 0;
    
    this.user = this.userService.user;
    this.userService.userSource.subscribe(user => {
      this.user = user;
      this.loadRecentActivity();
    }, err => console.error(err));
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
    let index = e.index;
    // selected tab from main tab group
    this.cookies.put('selectedDashboardTab', `${index}`);
    if (this.adminPanel && index === 2) {
      console.log('loading admin data.');
      this.adminPanel.loadData();
    } else if (this.moderatorPanel && index == 3) {
      this.moderatorPanel.loadData()
    }
  }

}
