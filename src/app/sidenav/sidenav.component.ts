import { Component, ViewEncapsulation } from '@angular/core';
// import { MdSidenav } from '@angular/material';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent {
  invert = false;
}
