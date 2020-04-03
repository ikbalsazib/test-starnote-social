import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FlexModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignupFieldComponent} from './signup-field/signup-field.component';
import {PhoneLoginComponent} from './phone-login/phone-login.component';
import {ReactionComponent} from './reaction/reaction.component';
import {UserReactionComponent} from './user-reaction/user-reaction.component';
import {ProfileShortComponent} from './profile-short/profile-short.component';
import {MatDialogModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {PostAuthComponent} from './post-auth/post-auth.component';
import {SharedPipesModule} from '../pipes/shared-pipes.module';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {EmailLoginComponent} from './email-login/email-login.component';



@NgModule({
    declarations: [
        SignupFieldComponent,
        PhoneLoginComponent,
        ReactionComponent,
        UserReactionComponent,
        ProfileShortComponent,
        PostAuthComponent,
        EmailLoginComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        FlexModule,
        RouterModule,
        SharedPipesModule,
        MatFormFieldModule,
        MatInputModule,
        Ng2TelInputModule,
    ],
    exports: [
        SignupFieldComponent,
        PhoneLoginComponent,
        ReactionComponent,
        UserReactionComponent,
        ProfileShortComponent,
        PostAuthComponent,
        MatDialogModule,
        EmailLoginComponent,

    ]
})
export class ComponentModule { }
