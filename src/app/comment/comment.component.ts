import { 
  Component, 
  Input,
  OnChanges,
  SimpleChange
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import {ForumService} from '../services/forum.service';
import {UserService} from '../services/user.service';
import { Entry } from '../entry/entry';
import { User } from '../user/user';
import { Comment } from './comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html'
})
export class CommentComponent implements OnChanges {
   @Input() comment: Comment;
   
   constructor(private forumService: ForumService, private userService: UserService) {}

   ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
     changes.comment && changes.comment.isFirstChange() && this.getOwner();
   }

   getOwner() {
    this.userService.getUser(this.comment.ownerId)
    .subscribe(user => {
      this.comment.owner = user;
    }, err => console.error(err));
   }

}