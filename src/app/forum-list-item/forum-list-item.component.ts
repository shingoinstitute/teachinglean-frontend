import { 
  Component, 
  OnDestroy, 
  AfterViewInit, 
  EventEmitter, 
  Output, 
  NgZone 
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {ForumService} from '../services/forum.service';
import {UserService} from '../services/user.service';
import { Entry } from '../entry/entry';
import { User } from '../user/user';

@Component({
  selector: 'forum-list-item',
  templateUrl: './forum-list-item.component.html',
  styleUrls: ['./forum-list-item.component.css']
})
export class ForumListItemComponent implements AfterViewInit {

  @Output() onEditorKeyup = new EventEmitter();
  entry = new Entry();
  currentUserId;
  observable: Observable<any>;
  canComment;
  canAnswer;
  didMarkAnswerCorrect = false;
  editor;
  answers: Entry[] = [];
  listenForUser: Subscription;
  characterCountMessage = "Enter 25 characters";

  constructor(private forumService: ForumService, private route: ActivatedRoute, userService: UserService, private zone: NgZone) {

    userService.pokeUserAsync();

    this.listenForUser = userService.userStatusChangeNotifier$.subscribe(
      hasUser => {
        this.canComment = hasUser;
        this.currentUserId = userService.user.uuid;
      }
    );

    this.loadData();

  }

  loadData() {
    console.log('fetching data...');
    this.route.params.subscribe((params: Params) => {
      this.forumService.getEntry(params['id'])
      .subscribe(
        data => {
          this.entry = Entry.initFromObject(data);
          this.answers = ForumService.extractEntries(this.entry.answers); 

          this.sortAnswers();
          this.loadAnswers();
          
        },
        error => console.error(error)
      );
    });
  }

  ngAfterViewInit() {
    tinymce.remove();
    tinymce.init({
      selector: '#question-textarea',
      plugins: [
        'advlist autolink lists link charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'table paste code'
      ],
      menubar: false,
      height: "300px",
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
      skin_url: '../assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        this.editor.on('keyup', () => {

          this.zone.run(() => {
            let characterCount = this.editor.getContent({format: 'text'}).length;

            this.characterCountMessage = characterCount > 25 ? `${500 - characterCount} characters left` : `Enter ${25 - characterCount} more characters`;

            // A user can submit an answer if their anwer is at least 25 characters in length
            // and they are logged in. If `this.canComment` is true, then we know a user is
            // logged in without needing to check again using the UserService.
            this.canAnswer = characterCount > 5 && this.canComment;
          })
        });
      },
    });
  }

  sortAnswers() {
    this.answers.sort((a, b) => {
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

  loadAnswers() {
    this.zone.runOutsideAngular(() => {
      // Detailed info for `this.answers` has not been provided at this point.
      // We can get this information by invoking `this.forumService.getEntry()` 
      // on each element of `this.answers`.
      this.answers.map(value => {
        return this.forumService.getEntry(value.id)
        .subscribe(
          data => {
              let entry = Entry.initFromObject(data);
              this.zone.run(() => {
              // The 'markedCorrect' attribute is fetched in this http request.
              // If an answer if marked correct, the answers array should be
              // re-sorted to reflect this new information.
              if (entry.markedCorrect) {
                this.sortAnswers();
              }
              return entry;
            });
          },
          err => console.error(err)
        );
      });
    });
  }

  onClickSubmitAnswer(event) {

    let answer = {
      content: this.editor.getContent(),
      parent: this.entry.id,
      owner: this.currentUserId,
      title: null
    };

    this.editor.setContent('');

    this.forumService.createEntry(answer)
    .subscribe(
      data => {
        this.loadData();
      },
      error => console.error(error)
    );
  }

  keyupHandler(event) {
    console.log(event);
  }

  createdAt(answer: Entry) {
    if (answer.createdAt) {
      return `${answer.createdAt.toLocaleDateString([], {month: "short", day: "numeric", year: "numeric"})}, ${answer.createdAt.toLocaleTimeString([], {"hour": "2-digit", "minute": "2-digit", "hour12": true})}`;
    }
  }

  markCorrect(answer: Entry) {
    this.forumService.markCorrect(answer.id)
    .subscribe(
      data => {
        answer.markedCorrect = this.didMarkAnswerCorrect = true;
      }
    );
  }

  unmarkCorrect(answer: Entry) {
    this.forumService.markIncorrect(answer.id)
    .subscribe(
      data => {
        answer.markedCorrect = this.didMarkAnswerCorrect = false;
      }
    )
  }

}
