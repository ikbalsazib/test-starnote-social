import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileViewPageRoutingModule } from './profile-view-routing.module';

import { ProfileViewPage } from './profile-view.page';
import {CoreModule} from '../../core/core.module';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileViewPageRoutingModule,
    CoreModule,
    StarToolbarPageModule,
  ],
  declarations: [ProfileViewPage]
})
export class ProfileViewPageModule {}
