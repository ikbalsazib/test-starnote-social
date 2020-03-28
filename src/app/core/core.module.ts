import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {PopoverContentComponent} from './popover-content/popover-content.component';



@NgModule({
    declarations: [
        PopoverContentComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FlexModule,
        RouterModule,
        ExtendedModule
    ],
    exports: [
        PopoverContentComponent
    ]
})
export class CoreModule { }
