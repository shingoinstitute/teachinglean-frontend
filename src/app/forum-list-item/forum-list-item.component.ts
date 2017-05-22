import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {ForumService} from '../services/forum.service';
import {UserService} from '../services/user.service';
import { Entry } from '../forum/entry';

@Component({
  selector: 'forum-list-item',
  templateUrl: './forum-list-item.component.html',
  styleUrls: ['./forum-list-item.component.css']
})
export class ForumListItemComponent implements OnInit, OnDestroy, AfterViewInit {

  private entry = new Entry();
  private currentUserId;
  private observable: Observable<any>;
  canComment;
  canAnswer;
  private editor;
  answers: Entry[] = [];
  private listenForUser: Subscription;
  characterCount = 0;

  constructor(private forumService: ForumService, private route: ActivatedRoute, userService: UserService) {

    this.listenForUser = userService.userStatusChangeNotifier$.subscribe(
      hasUser => {
        this.canComment = this.canAnswer = hasUser;
        this.currentUserId = userService.user.uuid;
      }
    );

    route.params.subscribe((params: Params) => {
      forumService.getEntry(params['id'])
      .subscribe(
        data => {
          console.log('ENTRY: ', data);
          this.entry = Entry.initFromObject(data);
          this.answers = ForumService.extractEntries(this.entry.answers);
          console.log('Answers: ', this.answers);
        },
        error => console.log(error)
      );
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.listenForUser.unsubscribe();
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
          this.characterCount = this.editor.getContent({format: 'text'}).length;
          if (this.characterCount > 500) {
            this.editor.setMode('readonly');
          }
        });
      },
    });
  }

  onClickSubmitAnswer(event) {
    let answer = Entry.initFromObject({
      content: this.editor.getContent(),
      parent: this.entry.id,
      owner: this.currentUserId
    });
    this.forumService.createEntry(answer)
    .subscribe(
      data => console.log(data),
      error => console.error(error)
    );
  }

}
