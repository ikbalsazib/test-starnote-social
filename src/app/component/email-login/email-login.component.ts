import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserAuthService} from '../../services/user-auth.service';
import {Router} from '@angular/router';
import {UiService} from '../../services/ui.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {

  // Email..
  emailLoginForm: FormGroup;
  email = new FormControl(null, {validators: [Validators.required, Validators.email]});
  password = new FormControl(null, {validators: [Validators.required]});

  constructor(
      private userAuthService: UserAuthService,
      private router: Router,
      private uiService: UiService,
      private alertController: AlertController
  ) { }

  ngOnInit() {
    // Email Login Form..
    this.emailLoginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  onEmailLogin() {
    if (this.emailLoginForm.invalid) {
      this.uiService.showToastMessage('Please complete all the required field.');
      return;
    }
    this.uiService.showLoadingBar('Logging In...');
    const email = this.emailLoginForm.value.email;
    const password = this.emailLoginForm.value.password;
    this.userAuthService.SignIn(email, password);
  }

  forgetPassword() {
    this.presentAlertPrompt();
    // this.userAuthService.ForgotPassword('');
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Password Reset!',
      backdropDismiss: false,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Enter your email address...'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            this.uiService.showToastMessage('Cancel! Password reset canceled.');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(alertData.email)) {
              this.userAuthService.ForgotPassword(alertData.email);
              return true;
            } else {
              this.uiService.showToastMessage('Invalid Email Address.');
              return false;
            }
          }
        }
      ],
    });

    await alert.present();
  }
}
