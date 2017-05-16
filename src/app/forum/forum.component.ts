import { Component, OnInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { MdIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import {Entry} from "./entry";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  providers: [ForumService]
})
export class ForumComponent implements OnInit {

  topResults;

  isEditing = false;

  constructor(
    private forumService: ForumService,
    iconRegistry: MdIconRegistry,
    sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/ic_search_black_24px.svg'));
  }

  ngOnInit() {
    this.loadRecent();
  }

  loadRecent() {
    this.forumService.getRecent(10, '123abc')
      .subscribe(results => this.topResults = results);
  }

  onClickAskQuestion() {
    this.isEditing = true;
  }

  postQuestion() {
    this.isEditing = false;
    this.forumService.createEntry(new Entry())
      .subscribe(entry => console.log(entry));
  }

}
