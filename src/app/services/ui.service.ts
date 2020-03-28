import { Injectable } from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // loadingStateChanged = new Subject<boolean>();

  constructor(
      private toastController: ToastController,
      public loadingController: LoadingController,
  ) { }

  async showLoadingBar(msg: string) {
    const loading = await this.loadingController.create({
      spinner: 'lines',
      // duration: 5000,
      message: msg,
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  async showToastMessage(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  hideLoadingBar() {
    this.loadingController.dismiss();
  }
}
