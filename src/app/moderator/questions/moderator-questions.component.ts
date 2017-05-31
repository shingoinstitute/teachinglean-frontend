import {
   Component,
   Input
} from '@angular/core';

import { ForumService } from '../../services/forum.service';

import { Entry } from '../../entry/entry';


@Component({
  selector: 'moderator-question-tab',
  templateUrl: './moderator-question-tab.component.html',
  styleUrls: ['../moderator.component.css']
})
export class ModeratorQuestionTab {
  @Input() questions: Entry[];

  constructor(private service: ForumService) {

  }
}