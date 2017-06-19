import {
  Component,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  Input,
  NgZone,
  ElementRef
} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { MdSnackBar } from '@angular/material';

import { UserService } from '../services/user.service';
import { ForumService } from '../services/forum.service';
import { User } from '../user/user';
import { Entry } from '../entry/entry';
import { AppRoutingService } from '../services/app-routing.service';

@Component({
  selector: 'ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
  providers: [AppRoutingService],
  animations: [
    trigger('questionState', [
      state('active', style({ opacity: 1 })),
      state('inactive', style({ opacity: 0, display: 'none' })),
      transition('* => inactive', [
        style({ opacity: 1 }),
        animate(200)
      ]),
      transition('* => active', animate(0))
    ])
  ]
})
export class AskQuestionComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() submitQuestion = new EventEmitter<any>();
  user: User;
  editor;
  title = '';
  content = '';
  submittedQuestion: Entry;
  questionState = 'active';
  constructor(
    private userService: UserService, 
    private appRouter: AppRoutingService, 
    private zone: NgZone,
    private snackbar: MdSnackBar,
    private forumService: ForumService) {
    // TODO :: Implement appRouter to redirect user to login page then back to Q&A Forum after sign in
    this.user = userService.user;
    userService.onDeliverableUser$.subscribe(user => {
      this.user = user;
    }, err => {
      console.log(err);
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    tinymce.remove();
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
        editor.on('keyup', () => {
          this.zone.run(() => {
            this.content = this.editor.getContent();
          });
        })
      },
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  onClickSubmitQuestion(e) {
    // If the title and question content are not empty, allow question to be submitted.
    if (this.title.length > 0 && this.content.length > 0) {
      this.forumService.createEntry({
        owner: this.userService.user.uuid,
        title: this.title,
        content: this.content,
        parent: null
      }).subscribe(entry => {
        this.submittedQuestion = Entry.initFromObject(entry);
        this.questionState = 'inactive';
        this.snackbar.open('Question Submitted!', 'Okay', {
          duration: 5000
        });
      }, error => {
        console.error(error);
      });
    }
  }
  

}
