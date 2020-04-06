import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileViewPage } from './my-profile-view.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfileViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileViewPageRoutingModule {}
