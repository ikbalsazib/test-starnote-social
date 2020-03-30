import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FlexModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {LoginFieldComponent} from './login-field/login-field.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignupFieldComponent} from './signup-field/signup-field.component';
import {PhoneLoginComponent} from './phone-login/phone-login.component';
import {ReactionComponent} from './reaction/reaction.component';
import {UserReactionComponent} from './user-reaction/user-reaction.component';
import {ProfileShortComponent} from './profile-short/profile-short.component';
import {MatDialogModule} from '@angular/material';



@NgModule({
    declarations: [
        LoginFieldComponent,
        SignupFieldComponent,
        PhoneLoginComponent,
        ReactionComponent,
        UserReactionComponent,
        ProfileShortComponent
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
        PhoneLoginComponent,
        ReactionComponent,
        UserReactionComponent,
        ProfileShortComponent,
        MatDialogModule
    ]
})
export class ComponentModule { }
