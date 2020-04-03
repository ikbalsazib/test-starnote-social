import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestPageRoutingModule } from './test-routing.module';

import { TestPage } from './test.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TestPageRoutingModule,
        CoreModule,
        StarToolbarPageModule,
        InfiniteScrollModule
    ],
  declarations: [TestPage]
})
export class TestPageModule {}
