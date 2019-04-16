import { Component, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'disable-user-dialog',
  template: `
  <h3>Warning</h3>
  <p>Disabling this account will reset their password to prevent login attempts.</p>
  <p>Disabling accounts potentially has irreversible side effects, continue?</p>
  <form>
  	<button md-button (click)="continue()">CONTINUE</button>
  	<button md-raised-button class="mat-primary white-text" (click)="cancel()">CANCEL</button>
  </form>
  `
})
export class DisableUserDialog {
  constructor(public dialogRef: MatDialogRef<DisableUserDialog>, private zone: NgZone) {}
  continue() { this.zone.run(() => { this.dialogRef.close(false); }) }
  cancel() { this.zone.run(() => { this.dialogRef.close(true); }) }
}
