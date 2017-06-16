import {
   Component,
   OnInit,
   Input
} from '@angular/core';

import { ForumService } from '../../services/forum.service';
import { MdSnackBar } from '@angular/material';
import { Entry } from '../../entry/entry';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'moderator-question-tab',
  templateUrl: './moderator-question-tab.component.html',
  styleUrls: ['../moderator.component.css']
})
export class ModeratorQuestionTab implements OnInit {
  
  @Input() questions: Entry[];
  private selectedQuestions = {};

  constructor(private service: ForumService, private snackbar: MdSnackBar) {}

  ngOnInit() {
    // TODO: Sort questions
  }

  onclickCheckbox(e) {
    let isChecked = e.checked;
    let id = e.source.id;
    if (id === -1 && isChecked) {
      this.questions.map(q => {
        this.selectedQuestions[q.id] = true;
      });
    } else if (id === -1 && !isChecked) {
      this.selectedQuestions = {};
    } else if (isChecked) {
      this.selectedQuestions[id] = true;
    } else if (!isChecked) {
      delete this.selectedQuestions[id];
    }
  }

  onclickDelete(e) {

    let observable = Observable.create(observer => {
      for (let key in this.selectedQuestions) {
        observer.next(this.deleteQuestion(key));
      }
      observer.complete();
    });

    observable.subscribe({
      next: () => {
        console.log('deletion successful');
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.snackbar.open('Questions deleted.', 'Okay', {
          duration: 2500
        });
        this.questions = this.questions.filter((question) => {
          if (!this.selectedQuestions[question.id]) {
            return question;
          }
        });
      }
    });
  }

  deleteQuestion(id) {
    this.service.destroyEntry(id).subscribe(entry => {
      return entry;
    }, err => {
      return Observable.throw(err);
    });
  }

}