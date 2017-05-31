import {
   AfterViewInit,
   OnChanges,
   Input,
   Component
} from '@angular/core';

import { ForumService } from '../../services/forum.service';

import { Entry } from '../../entry/entry';

@Component({
  selector: 'moderator-answer-tab',
  templateUrl: './moderator-answer-tab.component.html',
  styleUrls: ['../moderator.component.css']
})
export class ModeratorAnswerTab {
  @Input() answers: Entry[];
  
  constructor(private service: ForumService) {}

  

}