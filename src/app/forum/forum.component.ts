import { Component, OnInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { MdIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


import {Entry} from "./entry";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  providers: [ForumService],
  animations: [
    trigger('shrinkGrow', [
      state('active', style({transform: 'translateX(0)', height: 'auto'})),
      state('inactive', style({transform: 'translateX(200%)', height: '0'})),
      transition('inactive => active', [
        style({transform: 'translateX(200%)'}),
        animate(200)
      ]),
      transition('active => inactive', [
        animate(200, style({transform: 'translateX(200%)'}))
      ])
    ])
  ]

})
export class ForumComponent implements OnInit {

  topResults;

  isEditing = false;

  questionDialogState = "inactive";

  questionContent;

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
    this.isEditing = !this.isEditing;
    this.questionDialogState = this.isEditing ? "active" : "inactive";
  }

  postQuestion() {
    this.isEditing = false;
    this.forumService.createEntry(new Entry())
      .subscribe(entry => console.log(entry));
  }

  onEditorKeyupHandler(event) {
    console.log(event);
  }

}
