import { Component, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { User } from '../user/user';
import { Entry } from './entry';
import { UserService } from '../services/user.service';
import { ForumService } from '../services/forum.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-entry-card',
   templateUrl: './entry-card.component.html',
   styleUrls: ['./entry.component.css']
})
export class EntryCardComponent implements OnDestroy {
   @Output() onclickMarkAnswer = new EventEmitter<Entry>();
   @Output() onclickDemarkAnswer = new EventEmitter<Entry>();
   @Input() entry: Entry;
   @Input() parentDidSelectEntry: boolean;
   get canComment(): boolean { return !!this.user }
   user: User;
   commentText: string;
   errMsg: string;
   userSubscription: Subscription;

   constructor(private forumService: ForumService, private userService: UserService) {
      this.user = userService.user;
      this.userSubscription = userService.onDeliverableUser$.subscribe(user => {
         this.user = user;
      });
   }

   ngOnDestroy() {
      this.userSubscription.unsubscribe();
   }

   onClickAddComment(event, entry) {
    let user = this.userService.user;
    let content = this.commentText;
    if (content && user && entry) {
      this.forumService.createComment({
        parent: entry.id,
        owner: user.uuid,
        content: content
      }).subscribe(data => {
         console.log(data);
      });
    } else {
      this.errMsg = "You cannot submit an empty comment!";
    }
  }

  onclickMarkAnswerButton() {
     this.entry.markedCorrect ? this.onclickDemarkAnswer.emit(this.entry) : this.onclickMarkAnswer.emit(this.entry);
  }

}