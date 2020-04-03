import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DateAgoPipe} from './date-ago.pipe';
import { ReversePipe } from './reverse.pipe';



@NgModule({
  declarations: [DateAgoPipe, ReversePipe],
  imports: [
    CommonModule
  ],
  exports: [DateAgoPipe, ReversePipe]
})
export class SharedPipesModule { }
