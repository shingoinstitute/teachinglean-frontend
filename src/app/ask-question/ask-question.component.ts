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
import { AppRoutingService } from '../services/app-routing.service';

@Component({
  selector: 'ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
  providers: [AppRoutingService],
  animations: [
    trigger('questionState', [
      state('q-active', style({ opacity: 1 })),
      state('q-inactive', style({ opacity: 0 })),
      transition('* => q-inactive', animate(200)),
      transition('* => q-active', animate(200))
    ])
  ]
})
export class AskQuestionComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() submitQuestion = new EventEmitter<any>();
  user: User;
  private editor;
  private title = '';
  private content = '';
  
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
        this.title = this.content = '';
        this.snackbar.open('Question Submitted', null, {
          duration: 2500
        });
      }, error => {
        console.error(error);
      });
    }

    // this.forumService.createEntry({
    //   owner: this.userService.user.uuid,
    //   title: question.title,
    //   content: question.content,
    //   parent: null
    // })
    // .subscribe(entry => console.log(entry), error => console.log(error));
  }
  

}
