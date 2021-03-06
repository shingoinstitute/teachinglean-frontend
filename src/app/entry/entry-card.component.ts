import { Component, Input, OnDestroy, EventEmitter, Output, OnInit } from '@angular/core';
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
  @Output() onClickAcceptButton = new EventEmitter<Entry>();
  @Output() onDestroyEntry = new EventEmitter<any>();
  @Input() entry: Entry;
  @Input() parentDidSelectEntry: boolean;
  @Input() canAcceptAnswer: boolean = false;
  get canComment(): boolean { return !!this.user }
  user: User;
  commentText: string;
  editor;
  isEditing = false;
  errMsg: string;
  userSubscription: Subscription;

  constructor(private forumService: ForumService, private userService: UserService) {
    this.user = userService.user;
    this.userService.onDeliverableUser$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.canAcceptAnswer = this.canAcceptAnswer;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription && this.userSubscription.unsubscribe)
      this.userSubscription.unsubscribe();
  }

  isOwner() {
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

  onclickDelete() {
    this.forumService.destroyEntry(this.entry.id).subscribe(data => {
      this.onDestroyEntry.emit(this.entry.id);
      console.log(`Deleted entry`, data);
    }, err => {
      console.error(err);
    });
  }

  onclickCancel() {
    this.isEditing = false;
    tinymce.remove(this.editor);
  }

  onClickAddComment() {
    let user = this.userService.user;
    let content = this.commentText;
    if (content && user && this.entry) {
      this.forumService.createComment({
        parent: this.entry.id,
        owner: user.uuid,
        content: content
      }).subscribe(data => {
        delete this.commentText;
        let comment: Comment = Comment.initFromObject(data);
        this.entry.comments.push(comment);
      }, err => {
        this.errMsg = "An error occured, please try again.";
        console.error(err);
      });
    } else {
      this.errMsg = "You cannot submit an empty comment!";
    }
  }

  onclickMarkAnswerButton() {
    this.entry.markedCorrect = !this.entry.markedCorrect;
    this.onClickAcceptButton.emit(this.entry);
  }

}