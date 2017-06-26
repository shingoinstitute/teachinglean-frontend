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
    /**
     * When the `Edit Profile` tab is selected, TinyMceDirective loads a wyziwig that 
     * is performance intensive. Using setTimeout() allows tab transition animations to 
     * complete before loading extra stuff into the view, thus improving the UX.
     */
    if (event.index === 1) {
      setTimeout(() => {
        this.shouldShowTinyEditor = (event.index === 1);
      }, 400);
    } else {
      this.shouldShowTinyEditor = false;
    }
  }
  
  onclickSave() {
    this.userService.updateUser(this.user).subscribe(user => {
      this.user = User.initFromObject(user);
      this.snackbar.open('Profile saved.', null, { duration: 2000 });
    }, err => { 
      this.snackbar.open('Error, Profile Failed to Save.', 'Okay');
      console.error(err); 
    });
  }

  uploadPhoto() {
    let file = this.photoUpload.nativeElement.files.item(0);
    file && this.userService.uploadPhotoAsync(file);
  }

}