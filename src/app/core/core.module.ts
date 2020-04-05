import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {PopoverContentComponent} from './popover-content/popover-content.component';
import {MobileSidebarContentComponent} from './mobile-sidebar-content/mobile-sidebar-content.component';



@NgModule({
    declarations: [
        PopoverContentComponent,
        MobileSidebarContentComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FlexModule,
        RouterModule,
        ExtendedModule
    ],
    exports: [
        PopoverContentComponent,
        MobileSidebarContentComponent
    ]
})
export class CoreModule { }
