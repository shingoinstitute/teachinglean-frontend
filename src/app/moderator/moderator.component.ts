import { Component, HostListener, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { UserService } from '../services/user.service';
import { ForumService } from '../services/forum.service';

import { User } from '../user/user';
import { Entry } from '../entry/entry';



@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('show', style({ opacity: 1 })),
      state('hide', style({ opacity: 0 })),
      transition('* => show', [ style({ opacity: 0 }), animate('100ms ease-in') ]),
      transition('* => hide', [ style({ opacity: 1 }), animate('100ms ease-out') ])
    ]),
  ]
})
export class ModeratorComponent {

  private users: User[];
  selectedUser: User;
  selectedUserQuestions: Entry[] = [];
  selectedUserAnswers: Entry[] = [];
  selectedUserComments: Entry[] = [];

  comments: Entry[];
  questions: Entry[];
  answers: Entry[];

  private windowWidth;

  elementState = 'hide';
  userState = 'inactive';
  private nextUser: User;

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

  loadDataForTab(e) {
    switch (e.index) {
      case 1:
        this.loadAllQuestions();
        break;
      case 2:
      this.loadAllAnswers();
        break;
      case 3:
      this.loadAllComments();
        break;

      default:
        break;
    }
  }

  loadAllQuestions() {
    if (!this.questions) {
      this.forumService.requestQuestions().subscribe(data => {
        this.questions = data.map(Entry.initFromObject);
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
    } else if (this.selectedUser == user) {
      this.elementState = 'hide';
      this.userState = 'inactive';
    } else {
      this.nextUser = user;
      this.elementState = 'hide';
    }
  }

  animationDone(e) {
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

  changeListWidth() {
    return this.windowWidth > 960 ? {width: '350px'} : {width: 'auto'};
  }

}

@Component({
  selector: 'moderator-question-tab',
  templateUrl: './moderator-question-tab.component.html',
  styleUrls: ['./moderator.component.css']
})
export class ModeratorQuestionTab {
  @Input() questions: Entry[];

  constructor(private service: ForumService) {
    if (!this.questions) {
      service.requestQuestions()
      .subscribe(data => {
        this.questions = data.map(Entry.initFromObject);
      });
    }
  }

  getParent(entry: Entry) {

    if (entry.parent && entry.parent.title) {
      return;
    }

    let parentId;
    if (entry.parent instanceof Entry) {
      parentId = entry.parent.id;
    } else if (entry._parentId) {
      parentId = entry._parentId;
    }

    this.service.getEntry(parentId)
    .subscribe((parent: Entry) => {
      console.log('Parent: ', parent);
      console.log('parent is entry? ' + (parent instanceof Entry));
      entry.parent = parent;
    });
  }

}

@Component({
  selector: 'moderator-answer-tab',
  templateUrl: './moderator-answer-tab.component.html',
  styleUrls: ['./moderator.component.css']
})
export class ModeratorAnswerTab {
  @Input() answers: Entry[];

  constructor(private service: ForumService) {
    if (!this.answers) {
      service.requestAnswers()
      .subscribe(data => {
        this.answers = data.map(Entry.initFromObject);
      });
    }
  }

  getParentTitle(entry: Entry) {
    console.log('@moderator.component: ', entry);
    
  }

}

@Component({
  selector: 'moderator-comment-tab',
  templateUrl: './moderator-comment-tab.component.html',
  styleUrls: ['./moderator.component.css']
})
export class ModeratorCommentTab {
  @Input() comments: Entry[];

  constructor(service: ForumService) {
    if (!this.comments) {
      service.requestComments().subscribe(data => {
        console.log(data);
        this.comments = data.map(Entry.initFromObject);
      });
    }
  }

}