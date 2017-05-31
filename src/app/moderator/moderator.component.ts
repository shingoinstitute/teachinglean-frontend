// Angular
import { 
  Component, 
  HostListener,
  OnChanges,
  EventEmitter,
  Output,
  SimpleChange,
  AfterViewInit,
  Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { ModeratorQuestionTab } from './questions/moderator-questions.component';

// Custom Services
import { UserService }  from '../services/user.service';
import { ForumService } from '../services/forum.service';

// Misc
import { User }         from '../user/user';
import { Entry }        from '../entry/entry';

// Moderator Component
@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('show', style({ opacity: 1 })),
      state('hide', style({ opacity: 0 })),
      transition('* => show', [ style({ opacity: 0 }), animate('200ms ease-in') ]),
      transition('* => hide', [ style({ opacity: 1 }), animate('200ms ease-out') ])
    ]),
  ]
})
export class ModeratorComponent {

  @Output() onClickQuestionTab$   = new EventEmitter<any>();
  @Output() onClickAnswerTab$     = new EventEmitter<any>();
  @Output() onClickCommentTab$    = new EventEmitter<any>();

  private users:         User[];
  private nextUser:      User;
  selectedUser:          User;

  private comments:      Entry[];
  private questions:     Entry[];
  private answers:       Entry[];

  selectedUserQuestions: Entry[] = [];
  selectedUserAnswers:   Entry[] = [];
  selectedUserComments:  Entry[] = [];

  windowWidth:  number;
  elementState: string = 'hide';
  userState:    string = 'inactive';

  constructor(private userService: UserService, private forumService: ForumService) {
    userService.getUsersAsync()
    .then(users => {
      this.users = users.sort((a, b) => {
        return a.lastname > b.lastname ? 1: -1;
      });
    })
    .catch(err => console.error(err));
    this.windowWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(e) {
    this.windowWidth = window.innerWidth;
  }

  loadDataForTab($ev) {
    let index = $ev.index;
    if (index == 1) {
      console.log('loading questions');
      this.loadAllQuestions();
    } else if (index == 2) {
      console.log('loading answers');
      this.loadAllAnswers();
    } else if (index == 3) {
      console.log('loading comments');
      this.loadAllComments();
    }
  }

  loadAllQuestions() {
    if (!this.questions) {
      this.forumService.requestQuestions().subscribe(data => {
        this.questions = data.map(Entry.initFromObject);
        console.log('loaded questions: ', this.questions);
      });
    }
  }

  loadAllAnswers() {
    if (!this.answers) {
      this.forumService.requestAnswers().subscribe(data => {
        console.log(data);
        this.answers = data.map(Entry.initFromObject);
      });
    }
  }

  loadAllComments() {
    if (!this.comments) {
      this.forumService.requestComments().subscribe(data => {
        console.log(data);
        this.comments = data.map(Entry.initFromObject);
      });
    }
  }

  loadUserDetails() {
    this.loadUserQuestions();
    this.loadUserAnswers();
    this.loadUserComments();
  }

  loadUserQuestions() {
    this.forumService.requestUserQuestions(this.selectedUser.uuid).subscribe(data => {
      this.selectedUserQuestions = data.map(Entry.initFromObject);
    });
  }

  loadUserAnswers() {
    this.forumService.requestUserAnswers(this.selectedUser.uuid).subscribe(data => {
      this.selectedUserAnswers = data.map(Entry.initFromObject);
    });
  }

  loadUserComments() {
    this.forumService.requestUserComments(this.selectedUser.uuid).subscribe(data => {
      this.selectedUserComments = data.map(Entry.initFromObject);
    });
  }

  onClickUser(user: User) {
    if (!this.selectedUser) {
      this.selectedUser = user;
      this.userState = 'active';
      this.elementState = 'show';
    } else if (this.selectedUser.uuid === user.uuid) {
      this.elementState = 'hide';
      this.userState = 'inactive';
    } else {
      this.nextUser = user;
      this.elementState = 'hide';
    }
  }

  animateCompletionHandler(e) {
    if (this.userState === 'inactive') {
      delete this.selectedUser;
    } else if (this.nextUser) {
      this.selectedUser = this.nextUser;
      delete this.nextUser;
      this.elementState = 'show';
    } else {
      this.elementState = 'show';
    }
    if (this.selectedUser) {
      this.loadUserDetails();
    }
  }

  onClickTab($ev) {
    let index = $ev.index;
    if (index == 0) {
      this.onClickQuestionTab$.emit()
    } else if (index == 1) {
      this.onClickAnswerTab$.emit()
    } else if (index == 2) {
      this.onClickCommentTab$.emit();
    }
  }

  changeListWidth() {
    return this.windowWidth > 960 ? {width: '350px'} : {width: 'auto'};
  }

}





