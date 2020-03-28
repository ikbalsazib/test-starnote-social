import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WindowService} from '../../services/window.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss'],
})
export class PhoneLoginComponent implements OnInit {

  windowRef: any;
  verificationCode: string;

  user: any;
  // Input Form...
  // Phone..
  phoneLoginForm: FormGroup;
  phone = new FormControl(null, {validators: [Validators.required]});

  constructor(private win: WindowService, private router: Router) { }

  ngOnInit() {
    // Phone Login Form..
    this.phoneLoginForm = new FormGroup({
      phone: this.phone
    });

    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    this.windowRef.recaptchaVerifier
        .render()
        .then( widgetId => {

          this.windowRef.recaptchaWidgetId = widgetId;
        });
  }


  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = this.phoneLoginForm.value.phone;

    firebase.auth()
        .signInWithPhoneNumber(num, appVerifier)
        .then(result => {

          this.windowRef.confirmationResult = result;

        })
        .catch( error => console.log(error) );

  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
        .confirm(this.verificationCode)
        .then( result => {
          this.user = result.user;
          this.router.navigate(['/home']);

        })
        .catch( error => console.log(error, 'Incorrect code entered?'));
  }

  onPhoneLogin() {
    console.log(this.phoneLoginForm.value.phone);
  }
}
