import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestTwoPageRoutingModule } from './test-two-routing.module';

import { TestTwoPage } from './test-two.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';
import {MatInputModule, MatTooltipModule} from '@angular/material';
import {FlexModule} from '@angular/flex-layout';
import {ComponentModule} from '../../component/component.module';
import {SharedPipesModule} from '../../pipes/shared-pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TestTwoPageRoutingModule,
        StarToolbarPageModule,
        CoreModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTooltipModule,
        FlexModule,
        ComponentModule,
        SharedPipesModule
    ],
  declarations: [TestTwoPage]
})
export class TestTwoPageModule {}
