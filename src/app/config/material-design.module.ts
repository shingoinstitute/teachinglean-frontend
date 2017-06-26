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
    MdToolbarModule
} from '@angular/material';

@NgModule({
    imports: [
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
