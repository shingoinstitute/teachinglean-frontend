import { NgModule } from '@angular/core';
import { 
    MdCardModule, 
    MdButtonModule, 
    MdInputModule,
    MdSnackBarModule ,
    MdTabsModule,
    MdMenuModule,
    MdDialogModule,
    MdListModule,
    MdIconModule,
    MdSidenavModule,
    MdProgressSpinnerModule,
    MdToolbarModule,
    MaterialModule
} from '@angular/material';

@NgModule({
    imports: [
        MaterialModule,
        MdButtonModule,
        MdSnackBarModule,
        MdTabsModule,
        MdMenuModule,
        MdDialogModule,
        MdListModule,
        MdIconModule,
        MdSidenavModule,
        MdProgressSpinnerModule,
        MdToolbarModule
    ],
    exports: [
        MaterialModule,
        MdButtonModule,
        MdSnackBarModule,
        MdTabsModule,
        MdMenuModule,
        MdDialogModule,
        MdListModule,
        MdIconModule,
        MdSidenavModule,
        MdProgressSpinnerModule,
        MdToolbarModule
    ],
    providers: []
})
export class MaterialDesignImports { }
