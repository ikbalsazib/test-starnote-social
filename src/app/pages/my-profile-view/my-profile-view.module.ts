import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileViewPageRoutingModule } from './my-profile-view-routing.module';

import { MyProfileViewPage } from './my-profile-view.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';
import {SharedPipesModule} from '../../pipes/shared-pipes.module';
import {ComponentModule} from '../../component/component.module';
import {ImageCropperModule} from 'ngx-image-cropper';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyProfileViewPageRoutingModule,
        CoreModule,
        StarToolbarPageModule,
        SharedPipesModule,
        ComponentModule,
        ImageCropperModule
    ],
  declarations: [MyProfileViewPage]
})
export class MyProfileViewPageModule {}
