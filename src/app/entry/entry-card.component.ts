import { Component, Input, OnDestroy, EventEmitter, Output, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { User } from '../user/user';
import { Entry } from './entry';
import { Comment } from '../comment/comment';
import { UserService } from '../services/user.service';
import { ForumService } from '../services/forum.service';
import { Subscription } from 'rxjs';

// declare const tinymce: any;

@Component({
   selector: 'app-entry-card',
   templateUrl: './entry-card.component.html',
   styleUrls: ['./entry.component.css']
})
export class EntryCardComponent implements OnInit, OnDestroy {
   @Output() onclickMarkAnswer = new EventEmitter<Entry>();
   @Output() onclickDemarkAnswer = new EventEmitter<Entry>();
   @Input() entry: Entry;
   @Input() parentDidSelectEntry: boolean;
   get canComment(): boolean { return !!this.user }
   user: User;
   commentText: string;
   editor;
   isEditing = false;
   errMsg: string;
   userSubscription: Subscription;

   constructor(private forumService: ForumService, private userService: UserService) {
      this.user = userService.user;
      this.userSubscription = userService.onDeliverableUser$.subscribe(user => {
         this.user = user;
      }, err => {return;});
   }

   ngOnInit() { }

   ngOnDestroy() {
      this.userSubscription.unsubscribe();
   }

   isOwner(entry: Entry) {
     if (this.entry && this.user) {
       return !!this.entry.owner && this.entry.owner.uuid === this.user.uuid;
     }
     return false;
   }

   onclickEdit() {
      this.isEditing = true;
      tinymce.init({
         selector: '#entry-content-' + this.entry.id,
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
         },
      });
      this.editor && this.editor.setContent(this.entry.content || "");
   }

   onclickSave() {
      this.entry.content = this.editor.getContent();
      this.isEditing = false;
      tinymce.remove(this.editor);
      this.forumService.updateEntry(this.entry).subscribe(data => {
         this.entry = Entry.initFromObject(data);
      }, err => {
         console.error(err);
      });
   }

   onclickCancel() {
      this.isEditing = false;
      tinymce.remove(this.editor);
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
         delete this.commentText;
         let comment: Comment = Comment.initFromObject(data);
         this.entry.comments.push(comment);
      }, err => {
         this.errMsg = "An error occured, please try again."
      });
    } else {
      this.errMsg = "You cannot submit an empty comment!";
    }
  }

  onclickMarkAnswerButton() {
     this.entry.markedCorrect ? this.onclickDemarkAnswer.emit(this.entry) : this.onclickMarkAnswer.emit(this.entry);
  }

}