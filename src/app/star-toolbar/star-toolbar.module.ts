import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StarToolbarPageRoutingModule } from './star-toolbar-routing.module';

import { StarToolbarPage } from './star-toolbar.page';
import {FlexModule} from '@angular/flex-layout';
import {PopoverContentComponent} from '../core/popover-content/popover-content.component';

@NgModule({
    entryComponents: [PopoverContentComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StarToolbarPageRoutingModule,
        FlexModule
    ],
    exports: [
        StarToolbarPage
    ],
    declarations: [StarToolbarPage]
})
export class StarToolbarPageModule {}
