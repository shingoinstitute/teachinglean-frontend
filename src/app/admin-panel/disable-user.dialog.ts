import { Component } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';

@Component({
  selector: 'disable-user-dialog',
  template: `
  <h3>Warning</h3>
  <p>Disabling this account will reset their password to prevent login attempts.</p>
  <p>Disabling accounts potentially has irreversible side effects, continue?</p>
  <form>
  	<button md-button (click)="dialogRef.close(false)">CONTINUE</button>
  	<button md-raised-button class="mat-primary white-text" (click)="dialogRef.close(true)">CANCEL</button>
  </form>
  `
})
export class DisableUserDialog {
  constructor(public dialogRef: MdDialogRef<DisableUserDialog>) {}
}