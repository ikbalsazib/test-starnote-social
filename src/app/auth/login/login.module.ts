import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import {AngularMaterialModule} from '../../angular-material/angular-material.module';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {ComponentModule} from '../../component/component.module';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {AdditionalInfoModule} from '../../additional-info/additional-info.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        LoginPageRoutingModule,
        AngularMaterialModule,
        FlexModule,
        ComponentModule,
        Ng2TelInputModule,
        AdditionalInfoModule,
        FlexLayoutModule
    ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
