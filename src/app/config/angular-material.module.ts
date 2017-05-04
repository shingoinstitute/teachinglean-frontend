import { NgModule } from '@angular/core';
import { MaterialModule, MdCardModule, MdButtonModule } from '@angular/material';

@NgModule({
    imports: [
        MdCardModule,
        MdButtonModule
    ],
    exports: [
        MdCardModule,
        MdButtonModule
    ],
    providers: []
})
export class AngularMaterialModule { }
