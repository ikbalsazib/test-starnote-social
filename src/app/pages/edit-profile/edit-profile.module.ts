import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';
import {ComponentModule} from '../../component/component.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditProfilePageRoutingModule,
        CoreModule,
        StarToolbarPageModule,
        ComponentModule
    ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
