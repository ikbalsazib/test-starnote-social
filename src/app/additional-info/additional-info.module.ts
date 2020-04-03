import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginPageInfoComponent} from './login-page-info/login-page-info.component';




@NgModule({
    declarations: [
        LoginPageInfoComponent
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        LoginPageInfoComponent
    ]
})
export class AdditionalInfoModule { }
