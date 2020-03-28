import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';
import {AngularMaterialModule} from '../../angular-material/angular-material.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MessagesPageRoutingModule,
        CoreModule,
        StarToolbarPageModule,
        AngularMaterialModule
    ],
  declarations: [MessagesPage]
})
export class MessagesPageModule {}
