import { Injectable } from '@angular/core';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // loadingStateChanged = new Subject<boolean>();

  constructor(
      private toastController: ToastController,
      public loadingController: LoadingController,
      public alertController: AlertController
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

  async showAlertMessage(header: string, msg: string) {
    const alert = await this.alertController.create({
      header: header !== '' ? header : 'Alert',
      message: msg,
      buttons: ['OK']
    });

    return await alert.present();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Prompt!',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Placeholder 1'
        },
        {
          name: 'name2',
          type: 'text',
          id: 'name2-id',
          value: 'hello',
          placeholder: 'Placeholder 2'
        },
        // multiline input.
        {
          name: 'paragraph',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Placeholder 3'
        },
        {
          name: 'name3',
          value: 'http://ionicframework.com',
          type: 'url',
          placeholder: 'Favorite site ever'
        },
        // input date with min & max
        {
          name: 'name4',
          type: 'date',
          min: '2017-03-01',
          max: '2018-01-12'
        },
        // input date without min nor max
        {
          name: 'name5',
          type: 'date'
        },
        {
          name: 'name6',
          type: 'number',
          min: -5,
          max: 10
        },
        {
          name: 'name7',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  hideLoadingBar() {
    this.loadingController.dismiss();
  }
}
