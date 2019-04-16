import { Component, OnInit } from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['./teaching.component.css']
})
export class TeachingComponent implements OnInit {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('file-pdf', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/file-pdf.svg'));
    iconRegistry.addSvgIcon('file-word', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/file-word.svg'));
    iconRegistry.addSvgIcon('file-powerpoint', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/file-powerpoint.svg'));
  }

  ngOnInit() {
  }

}
