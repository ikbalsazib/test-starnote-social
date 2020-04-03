import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScrollPage } from './scroll.page';

const routes: Routes = [
  {
    path: '',
    component: ScrollPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScrollPageRoutingModule {}
