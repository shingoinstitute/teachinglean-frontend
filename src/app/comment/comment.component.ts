import { 
  Component, 
  Input,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { UserService } from '../services/user.service';
import { Comment }     from './comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html'
})
export class CommentComponent implements OnChanges {
   @Input() comment: Comment;
   
   constructor(private userService: UserService) {}

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