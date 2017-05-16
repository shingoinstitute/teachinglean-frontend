import {
  Component,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  Input
} from '@angular/core';


@Component({
  selector: 'ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() content;
  @Output() onEditorKeyup = new EventEmitter<any>();
  @Output() onClickPostQuestion = new EventEmitter<any>();

  editor;

  constructor() { }

  ngOnInit() {
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
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });
      },
    });

  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  onSubmitQuestion() {
    this.onClickPostQuestion.emit(this.editor.getContent());
  }

}
