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
import { Entry } from '../forum/entry';

@Component({
  selector: 'forum-list-item',
  templateUrl: './forum-list-item.component.html',
  styleUrls: ['./forum-list-item.component.css']
})
export class ForumListItemComponent implements OnDestroy, AfterViewInit {

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

    this.listenForUser = userService.userStatusChangeNotifier$.subscribe(
      hasUser => {
        this.canComment = hasUser;
        this.currentUserId = userService.user.uuid;
      }
    );

    route.params.subscribe((params: Params) => {
      forumService.getEntry(params['id'])
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

  ngOnDestroy() {
    this.listenForUser.unsubscribe();
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: 'textarea',
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
            this.canAnswer = characterCount > 25 && this.canComment;
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
      for (let i in this.answers) {
        if (this.answers[i]._ownerId == null) throw new Error('entry has no "_ownerId"');

        // Detailed info for `this.answers` has not been provided at this point.
        // We can get this information by invoking `this.forumService.getEntry()` 
        // on each element of `this.answers`.
        this.forumService.getEntry(this.answers[i].id)
        .subscribe(
          data => {
            this.zone.run(() => {
              this.answers[i] = Entry.initFromObject(data);
              console.log('ANSWER: ', this.answers[i]);
              // The 'markedCorrect' attribute is fetched in this http request.
              // If an answer if marked correct, the answers array should be
              // re-sorted to reflect this new information.
              if (this.answers[i].markedCorrect) {
                this.sortAnswers();
              }
            });
          },
          err => console.error(err)
        );
      }
    });
  }

  onClickSubmitAnswer(event) {

    let answer = {
      content: this.editor.getContent(),
      parent: this.entry.id,
      owner: this.currentUserId,
      title: null
    };
    
    this.forumService.createEntry(answer)
    .subscribe(
      data => console.log(data),
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
