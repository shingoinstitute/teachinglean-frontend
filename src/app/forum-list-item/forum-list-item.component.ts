import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  NgZone
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { UserService } from '../services/user.service';
import { Entry } from '../entry/entry';

import { TinyMceDirective } from '../tinymce.directive';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'forum-list-item',
  templateUrl: './forum-list-item.component.html',
  styleUrls: ['./forum-list-item.component.css']
})
export class ForumListItemComponent implements OnInit {

  @ViewChild(TinyMceDirective)
  set editor(view: TinyMceDirective) {
    view && view.initTinyMce();
    if (view) {
      this._editor = view;
      view.onKeyup.subscribe(value => {
        this.onEditorChange(value);
      });
    }
  }

  private _editor;

  questionContent: string = "";
  @Output() onEditorKeyup: EventEmitter<any> = new EventEmitter();
  minCharacterCount: number = 15;
  hasUser: boolean = false;
  question: Entry = new Entry();
  didMarkAnswerCorrect: boolean = false;
  canSubmitAnswer: boolean = false;
  characterCountMessage: string = "Enter 15 characters";

  constructor(private forumService: ForumService, private userService: UserService, private route: ActivatedRoute, public zone: NgZone) {
    this.hasUser = !!userService.user;
    userService.onDeliverableUser$.subscribe(user => {
      this.hasUser = !!user;
    }, err => {
      console.error(err);
    });
    this.loadData();
  }

  loadData() {
    // this.zone.runOutsideAngular(() => {
      this.route.params.subscribe((params: Params) => {
        this.forumService.getEntry(params['id'])
          .subscribe(data => {
            this.question = Entry.initFromObject(data);

            /**
             * @var this.question.answers
             * @description Resetting question.answers. When data for `this.question` is initially
             * loaded from `forumService.getEntry(arg...)`, `this.question.answers` doesn't
             * come back with all of their properties populated. To get the needed info
             * on answers, a new request is made for each answer with `this.populateAnswers(arg...)`
             */
            this.question.answers = [];

            let answers: Entry[] = [];
            if (data.answers)
              answers = data.answers.map(Entry.initFromObject);

            let populateAnswersChange: Observable<Entry> = this.populateAnswers(answers);
            
            const answerCount = data.answers ? data.answers.length : 0;
            // this.zone.run(() => {
              const popAnsObserver = populateAnswersChange.subscribe((answer: Entry) => {
                // Push answers back onto `this.question`
                this.question.answers.push(answer);
                // Sort answers when complete
                if (this.question.answers.length === answerCount) { this.sortAnswers(); }
              }, err => {
                console.error(err);
              });
            // });
          }, error => console.error(error));
      });
    // });
  }

  ngOnInit() { }

  onEditorChange(value) {
    this.zone.run(() => {
      let characterCount = value.length || 0;
      this.characterCountMessage = characterCount > this.minCharacterCount ? `${500 - characterCount} characters left` : `Enter ${this.minCharacterCount - characterCount} more characters`;

      // A user can submit an answer if their anwer is at least 25 characters in length
      // and they are logged in. If `this.canComment` is true, then we know a user is
      // logged in without needing to check again using the UserService.
      this.canSubmitAnswer = characterCount > this.minCharacterCount && !!this.userService.user;
    });
  }

  sortAnswers() {
    this.question.answers.sort((a, b) => {
      // The answer that is marked as correct (if any) should appear at the
      // top of the list of answers.
      if (a.markedCorrect) {
        this.didMarkAnswerCorrect = true;
        return -1;
      } else if (b.markedCorrect) {
        return 1;
      }
      // If neither answer is marked as correct, sort by date created
      return a.createdAt.valueOf() - b.createdAt.valueOf();
    });
  }

  populateAnswers(answers: Entry[]): Observable<Entry> {
    // Detailed info for `this.answers` has not been provided at this point.
    // We can get this information by calling `this.forumService.getEntry()` 
    // on each element of `this.answers`.
    // this.question.answers.forEach((e, i) => this.loadAnswer(e, i));
    const answerChanges = answers.map(answer => { return this.loadAnswer(answer); });
    return Observable.merge(...answerChanges);
  }

  private loadAnswer(answer: Entry): Observable<Entry> {
    return this.forumService.getEntry(answer.id)
    .map(data => {
      return Entry.initFromObject(data);
    })
    .first()
    .onErrorResumeNext()
    .catch(err => {
      return Observable.throw(err);
    });
  }

  onClickSubmitAnswer() {
    if (!this.userService.user) {
      return;
    }

    this.forumService.createEntry({
      content: this.questionContent,
      parent: this.question.id,
      owner: this.userService.user.uuid,
      title: null
    })
      .subscribe(data => {
        this._editor.clear();
        this.questionContent = '';
        this.loadData();
        console.log(data);
      });

  }

  setAnswerAccepted(answer: Entry) {
    this.forumService.setIsCorrect(answer)
      .subscribe((entry: Entry) => {
        answer.markedCorrect = entry.markedCorrect;
        console.log("updated entry");
      }, err => { console.error(err); });
  }

  onDeleteHandler(entryId) {
    console.log(`deleted entry ${entryId}.`);
    this.loadData();
  }

  canAcceptAnswer(answer: Entry) {
    try {
      const isQuestionChild: boolean = answer.parent.id == this.question.id;
      const isQuestionOwner: boolean = this.question.owner.uuid == this.userService.user.uuid;
      return isQuestionChild && isQuestionOwner;
    } catch (e) {
      return false;
    }
  }

}
