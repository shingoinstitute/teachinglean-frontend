import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {ForumService} from '../services/forum.service';
import { Entry } from '../forum/entry';

@Component({
  selector: 'forum-list-item',
  templateUrl: './forum-list-item.component.html',
  styleUrls: ['./forum-list-item.component.css']
})
export class ForumListItemComponent implements OnInit {

  // @ViewChild('entry') 
  // entry: Observable<Entry>;

  @ViewChild('entry') entry: any | {};

  private entryId;
  
  constructor(
    private forum: ForumService, 
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadEntry();
  }

  loadEntry() {
    this.route.params
    .switchMap((params: Params) => {
      this.entryId = params['id'];
      return this.forum.getEntry(this.entryId)
    }).subscribe(
      entry => {this.entry = entry},
      error => console.error(error)
    );
  }

}
