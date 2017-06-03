import { 
   Component,
   Input, 
   OnInit, 
   AfterViewChecked,
   EventEmitter,
   Output
 } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { UserService } from '../services/user.service';
import { Subject } from 'rxjs/Subject';
import { User } from './user';

@Component({
   selector: 'user-profile',
   templateUrl: './user-profile.component.html',
   styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewChecked {
   @Input() user: User;
   @Output() onSelectEditTab = new EventEmitter<boolean>();
   initialTabIndex = 1;
   editor;
   didAfterViewChecked = false;

   constructor() {
   }

   ngOnInit() {
   }

   onTabChange(event) {
     console.log('clicked le tab', event.index);
      this.onSelectEditTab.emit(event.index === 1);
   }

   ngAfterViewChecked() {
    !this.didAfterViewChecked && (() => {
      console.log('aaaahhhhhh!!!!!');
      this.didAfterViewChecked = true; 
      this.onTabChange({index: this.initialTabIndex});
    })();
   }

}