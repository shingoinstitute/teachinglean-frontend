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
export class ForumListItemComponent implements AfterViewInit, OnDestroy {

  @Output() onEditorKeyup = new EventEmitter();
  editor;
  currentUserId;
  canComment;
  canAnswer;

  entry = new Entry();
  didMarkAnswerCorrect = false;
  answers: Entry[] = [];
  
  characterCountMessage = "Enter 15 characters";
  altUserPictureUrl = "https://res.cloudinary.com/shingo/image/upload/v1414874243/silhouette_vzugec.png";

  constructor(private forumService: ForumService, private route: ActivatedRoute, userService: UserService, private zone: NgZone) {

    userService.getUserAsync()
    .then(user => {
      this.currentUserId = user.uuid;
      this.canComment = true;
    })

    this.loadData();
  }

  loadData() {
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

  ngOnDestroy() {
    
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

            this.characterCountMessage = characterCount > 15 ? `${500 - characterCount} characters left` : `Enter ${15 - characterCount} more characters`;

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
    // Detailed info for `this.answers` has not been provided at this point.
    // We can get this information by invoking `this.forumService.getEntry()` 
    // on each element of `this.answers`.
    this.answers.forEach((e, i) => this.loadAnswer(e, i));
  }

  private loadAnswer(answer: Entry, atIndex: number) {
    this.forumService.getEntry(answer.id).subscribe( data => {
      this.answers[atIndex] = Entry.initFromObject(data);
    },
    err => {
      console.error(err);
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
