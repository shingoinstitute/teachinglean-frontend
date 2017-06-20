import { NgModule } from '@angular/core';
import { 
    MdCardModule, 
    MdButtonModule, 
    MdInputModule,
    MdButtonToggleModule,
    MdSnackBarModule ,
    MdTabsModule,
    MdMenuModule,
    MdDialogModule,
    MdListModule,
    MdIconModule,
    MdSidenavModule,
    MdProgressSpinnerModule,
    MdCoreModule,
    MdToolbarModule,
    MdLineModule,
    MdCommonModule
} from '@angular/material';

@NgModule({
    imports: [
        MdCardModule,
        MdButtonModule,
        MdInputModule,
        MdSnackBarModule,
        MdButtonToggleModule,
        MdTabsModule,
        MdMenuModule,
        MdDialogModule,
        MdListModule,
        MdIconModule,
        MdSidenavModule,
        MdProgressSpinnerModule,
        MdCoreModule,
        MdToolbarModule,
        MdLineModule,
        MdCommonModule
    ],
    exports: [
        MdCardModule,
        MdButtonModule,
        MdInputModule,
        MdSnackBarModule,
        MdButtonToggleModule,
        MdTabsModule,
        MdMenuModule,
        MdDialogModule,
        MdListModule,
        MdIconModule,
        MdSidenavModule,
        MdProgressSpinnerModule,
        MdCoreModule,
        MdToolbarModule,
        MdLineModule,
        MdCommonModule
    ],
    providers: []
})
export class MaterialDesignModule { }
