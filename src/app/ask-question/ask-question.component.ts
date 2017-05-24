import {
  Component,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  Input,
  NgZone
} from '@angular/core';

import { UserService } from '../services/user.service';
import { AppRoutingService } from '../services/app-routing.service';

@Component({
  selector: 'ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
  providers: [AppRoutingService]
})
export class AskQuestionComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() submitQuestion = new EventEmitter<any>();

  private editor;
  private title: any;
  content: string;
  
  constructor(private userService: UserService, private appRouter: AppRoutingService, private zone: NgZone) {
    // TODO :: Implement appRouter to redirect user to login page then back to Q&A Forum after sign in
  }

  ngOnInit() {
  }

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
    this.submitQuestion.emit({
      content: this.content,
      title: this.title
    });
  }
  

}
