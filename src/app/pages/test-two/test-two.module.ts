import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestTwoPageRoutingModule } from './test-two-routing.module';

import { TestTwoPage } from './test-two.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TestTwoPageRoutingModule,
        StarToolbarPageModule,
        CoreModule
    ],
  declarations: [TestTwoPage]
})
export class TestTwoPageModule {}
