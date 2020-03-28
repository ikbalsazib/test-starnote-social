import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StarToolbarPage } from './star-toolbar.page';

const routes: Routes = [
  {
    path: '',
    component: StarToolbarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StarToolbarPageRoutingModule {}
