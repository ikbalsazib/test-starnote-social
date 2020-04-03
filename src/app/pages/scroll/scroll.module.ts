import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScrollPageRoutingModule } from './scroll-routing.module';

import { ScrollPage } from './scroll.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';
import {SharedPipesModule} from '../../pipes/shared-pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ScrollPageRoutingModule,
        StarToolbarPageModule,
        CoreModule,
        SharedPipesModule
    ],
  declarations: [ScrollPage]
})
export class ScrollPageModule {}
