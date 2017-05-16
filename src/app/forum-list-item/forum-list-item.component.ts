import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'forum-list-item',
  templateUrl: './forum-list-item.component.html',
  styleUrls: ['./forum-list-item.component.css']
})
export class ForumListItemComponent implements OnInit {

  @ViewChild('entry') entry: any | {};

  constructor() { }

  ngOnInit() {
  }

}
