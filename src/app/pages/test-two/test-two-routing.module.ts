import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestTwoPage } from './test-two.page';

const routes: Routes = [
  {
    path: '',
    component: TestTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestTwoPageRoutingModule {}
