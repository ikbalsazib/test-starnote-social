import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {CoreModule} from '../../core/core.module';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {ComponentModule} from '../../component/component.module';
import {SharedPipesModule} from '../../pipes/shared-pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        CoreModule,
        StarToolbarPageModule,
        ComponentModule,
        SharedPipesModule
    ],
    declarations: [HomePage]
})
export class HomePageModule {}
