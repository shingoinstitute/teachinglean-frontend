import {
   Component,
   Input
} from '@angular/core';

import { ForumService } from '../../services/forum.service';
import { Entry } from '../../entry/entry';

@Component({
  selector: 'moderator-comment-tab',
  templateUrl: './moderator-comment-tab.component.html',
  styleUrls: ['../moderator.component.css']
})
export class ModeratorCommentTab {
  @Input() comments: Entry[];

  constructor(service: ForumService) {}

}