import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FlexModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {LoginFieldComponent} from './login-field/login-field.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignupFieldComponent} from './signup-field/signup-field.component';
import {PhoneLoginComponent} from './phone-login/phone-login.component';



@NgModule({
    declarations: [
        LoginFieldComponent,
        SignupFieldComponent,
        PhoneLoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        FlexModule,
        RouterModule,
    ],
    exports: [
        LoginFieldComponent,
        SignupFieldComponent,
        PhoneLoginComponent
    ]
})
export class ComponentModule { }
