import {Component, NgZone, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WindowService} from '../../services/window.service';
import {NavigationExtras, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {UserAuthService} from '../../services/user-auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {UiService} from '../../services/ui.service';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss'],
})
export class PhoneLoginComponent implements OnInit {
    // Phone Number with ng2-tel-input...
    phoneNumber: any;
    isValid: any;
    // Recaptcha Need..
    windowRef: any;
    verificationCode: string;
    // Database..
    currentAuthUser: any;

    constructor(
        private win: WindowService,
        private router: Router,
        private db: AngularFireDatabase,
        private uiService: UiService,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        // Recaptcha...
        this.windowRef = this.win.windowRef;
        this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

        this.windowRef.recaptchaVerifier
            .render()
            .then( widgetId => {

                this.windowRef.recaptchaWidgetId = widgetId;
            });
    }

    hasError(event: any): void {
        this.isValid = event;
    }

    getNumber(event: any) {
        if (event) {
            this.phoneNumber = event;
        }
    }


    sendLoginCode() {

        const appVerifier = this.windowRef.recaptchaVerifier;

        if (!this.isValid) {
            this.uiService.showToastMessage('Invalid Phone Number! Please enter a valid phone number.');
            return;
        }


        firebase.auth()
            .signInWithPhoneNumber(this.phoneNumber, appVerifier)
            .then(result => {
              this.windowRef.confirmationResult = result;

            })
            .catch( error => this.uiService.showToastMessage('Something went wrong.') );

    }

    verifyLoginCode() {
        this.windowRef.confirmationResult
            .confirm(this.verificationCode)
            .then( (credential) => {
                this.currentAuthUser = credential.user;
                this.setAuthUserData(credential.user);
                this.getUserCompleteFieldData(this.currentAuthUser).valueChanges()
                    .subscribe(info => {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                special: JSON.stringify(info)
                            }
                        };
                        const numberOfField = Object.keys(info).length;
                        if (numberOfField < 15) {
                            this.router.navigate(['profile-completion'], navigationExtras);
                        } else {
                            this.ngZone.run(() => {
                                this.router.navigate(['home']);
                            });
                        }
                        // Reset Value..
                        this.phoneNumber = '';
                        this.verificationCode = '';
                        this.windowRef.confirmationResult = null;
                    });

            })
            .catch( error => this.uiService.showToastMessage('ERROR Code! Incorrect code entered?'));
    }

    setAuthUserData(user) {
        if (!user) { return; }
        const path = `Users/${user.uid}`;
        const userData: any = {
            uID: user.uid,
            phone: user.phoneNumber,
            // points: '',
            role: 'user',
            registrationType: 'phone',
            registeredTime: Date.now(),
            // referCode: '',
            // referable: '',
            // permission: '',
            // password: '',
            // deviceId: '',
            // randomCall: ''
        };
        this.db.object(path).update(userData);
    }

    getUserCompleteFieldData(user) {
        return this.db.object(`Users/${user.uid}`);
    }

}
