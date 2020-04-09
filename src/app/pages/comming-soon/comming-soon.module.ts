import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommingSoonPageRoutingModule } from './comming-soon-routing.module';

import { CommingSoonPage } from './comming-soon.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CoreModule,
        CommingSoonPageRoutingModule,
        StarToolbarPageModule
    ],
  declarations: [CommingSoonPage]
})
export class CommingSoonPageModule {}
