import {
  Component,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { TinyMceDirective } from '../tinymce.directive';
import { UserService } from '../services/user.service';
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

  constructor(private userService: UserService, private snackbar: MatSnackBar) {}

  shouldShowTinyEditor = false;

  /**
   * @desc :: When the `Edit Profile` tab is selected, TinyMceDirective loads a
   * wyziwig that is performance intensive. Using setTimeout() allows tab
   * transition animations to complete before loading extra stuff into the view,
   * thus improving the UX.
   */
  onclickTab(event) {
    if (event.index === 1) {
      setTimeout(() => {
        this.shouldShowTinyEditor = (event.index === 1);
      }, 400);
    } else {
      this.shouldShowTinyEditor = false;
    }
  }

  /**
   * @desc :: Saves/updates all fields with their current values
   * including firstname, lastname, username, organization name,
   * email, and biography.
   */
  onclickSave() {
    this.userService.updateUser(this.user).subscribe(user => {
      this.user = User.initFromObject(user);
      this.snackbar.open('Profile saved.', null, { duration: 2000 });
    }, err => {
      this.snackbar.open('Error, Profile Failed to Save.', 'Okay');
      console.error(err);
    });
  }

  /**
   * @desc :: Uploads profile picture to api
   */
  uploadPhoto() {
    let file = this.photoUpload.nativeElement.files.item(0);
    if (file) {
      this.userService.uploadPhotoAsync(file).subscribe(data => {
        console.log(data);
      }, err => {
        console.error(err);
      });
    }
  }

  uploadPhotoEnabled: boolean;
  onSelectPhoto() {
    this.uploadPhotoEnabled = !!this.photoUpload.nativeElement.files.item(0);
  }

  /**
   * @desc :: sends a password reset link to the
   * currently authenticated user's email
   */
  onclickReset() {
    this.userService.sendPasswordResetLink(this.user.email)
    .subscribe(data => {
      this.snackbar.open('Password reset link sent, please check your email for a message from shingo.it@usu.edu.', 'Okay');
      console.log(data);
    }, err => {
      this.snackbar.open('Server Error, please try again later.', 'Okay', { duration: 3000 });
      console.error(err);
    });
  }

}
