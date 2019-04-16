import { NgModule } from '@angular/core';
import {
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule ,
    MatTabsModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule
} from '@angular/material';

@NgModule({
    imports: [
        MatCardModule,
        MatButtonModule,
        MatSnackBarModule,
        MatTabsModule,
        MatMenuModule,
        MatDialogModule,
        MatInputModule,
        MatListModule,
        MatIconModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatToolbarModule
    ],
    exports: [
        MatButtonModule,
        MatSnackBarModule,
        MatTabsModule,
        MatMenuModule,
        MatDialogModule,
        MatListModule,
        MatIconModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatToolbarModule
    ],
    providers: []
})
export class MaterialDesignImports { }
