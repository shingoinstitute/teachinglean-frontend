import {
   AfterViewInit,
   OnChanges,
   Input,
   OnInit,
   NgZone,
   Component
} from '@angular/core';

import { ForumService } from '../../services/forum.service';

import { Entry } from '../../entry/entry';

@Component({
  selector: 'moderator-answer-tab',
  templateUrl: './moderator-answer-tab.component.html',
  styleUrls: ['../moderator.component.css']
})
export class ModeratorAnswerTab implements OnInit, OnChanges {
  @Input('answers') entries: Entry[];
  answers: Answer[];  
  
  constructor(private service: ForumService, private zone: NgZone) {}

  ngOnInit() {}

  ngOnChanges() {
    this.answers = [];
    this.entries && this.entries.map && this.entries.map(entry => {
      let answer = Answer.initFromEntry(entry);
      answer.initRouterLink(this.service);
      this.answers.push(answer);
    });
  }

}

class Answer extends Entry implements AnswerInterface {

  routerLink: string = ``;
  linkTitle: string = ``;

  get ownerName(): string {
    return this.owner && this.owner.name ? this.owner.name : "loading...";
  }

  constructor() {
    super();
  }

  static initFromEntry(entry: Entry) {
    let answer = new Answer();
    answer._parentId = entry._parentId;
    answer.parent = entry.parent;
    answer.id = entry.id;
    answer.content = entry.content;
    answer.owner = entry.owner;
    answer._ownerId = entry._ownerId;
    answer.createdAt = entry.createdAt;
    answer.updatedAt = entry.updatedAt;
    return answer;
  }

  initRouterLink(service: ForumService) {

    if (this.parent && this.parent.title){
      this.linkTitle = this.parent.title;
    }

    if (!this._parentId && this.parent && this.parent.id) {
      this._parentId = this.parent.id;
      this.routerLink = `/forum/${this._parentId}`
    } else {
      service.getEntry(this.id).subscribe(data => {
        this._parentId = data.parent.id;
        this.linkTitle = data.parent.title;
        this.routerLink = `/forum/${this._parentId}`
      });
    }
  }

}

interface AnswerInterface {
  initRouterLink(service: ForumService): void;
  routerLink: string;
  linkTitle: string;
  ownerName: string;
}