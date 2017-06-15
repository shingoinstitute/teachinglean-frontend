import { 
  Component,
  Input, 
  ViewChild,
  ElementRef
} from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { TinyMceDirective } from '../tinymce.directive';
import { UserService } from '../services/user.service';
import { Subject } from 'rxjs/Subject';
import { User } from './user';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  @Input() user: User;
  @ViewChild('fileUpload') photoUpload: ElementRef;
  @ViewChild(TinyMceDirective) 
  set tinymce(view: TinyMceDirective) {
    view && view.initTinyMce();
  }
  didClickSave = false;

  constructor(private userService: UserService, private snackbar: MdSnackBar) {}

  shouldShowTinyEditor = false;
  
  onclickTab(event) {
    this.shouldShowTinyEditor = (event.index === 1);
  }
  
  onclickSave() {
    this.userService.updateUserAsync(this.user)
    .then((user: User) => {
      this.user = user;
      this.snackbar.open('Profile saved.', null, { duration: 2000 });
    })
    .catch(err => {
      console.error(err);
    });
  }

  uploadPhoto() {
    let file = this.photoUpload.nativeElement.files.item(0);
    file && this.userService.uploadPhotoAsync(file);
  }

}