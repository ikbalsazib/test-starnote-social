import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePostPageRoutingModule } from './create-post-routing.module';

import { CreatePostPage } from './create-post.page';
import {StarToolbarPageModule} from '../../star-toolbar/star-toolbar.module';
import {CoreModule} from '../../core/core.module';
import {AngularMaterialModule} from '../../angular-material/angular-material.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreatePostPageRoutingModule,
        StarToolbarPageModule,
        CoreModule,
        ReactiveFormsModule,
        AngularMaterialModule
    ],
  declarations: [CreatePostPage]
})
export class CreatePostPageModule {}
