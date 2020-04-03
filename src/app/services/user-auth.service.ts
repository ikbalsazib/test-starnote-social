import {Injectable, NgZone} from '@angular/core';
import {auth} from 'firebase/app';
import {UserModel} from '../interfaces/user-model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavigationExtras, Router} from '@angular/router';
import {WindowService} from './window.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {UiService} from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(
      private db: AngularFireDatabase,
      private afAuth: AngularFireAuth,
      private router: Router,
      private ngZone: NgZone,
      private windowService: WindowService,
      private httpClient: HttpClient,
      public uiService: UiService
  ) {
    // Realtime Databases...
    this.userRef = db.list(this.dbPath);

    /* Saving user data in localstorage when
logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    // return (user !== null && user.emailVerified !== false);
    return (user !== null);
  }
  private dbPath = '/Users';
  userRef: AngularFireList<UserModel> = null;
  currentAuthUser: any;
  userData: any;
  windowRef: any;
    // private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
    private sent = false;

    userInfoo = {
        name: 'Simon Grimm',
        website: 'www.ionicacademy.com',
        address: {
            zip: 48149,
            city: 'Muenster',
            country: 'DE'
        },
        interests: [
            'Ionic', 'Angular', 'YouTube', 'Sports'
        ]
    };


  // Sign in with email/password
  SignIn(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((credential) => {
            if (credential.user.emailVerified !== true) {
                this.SignOut();
                this.uiService.hideLoadingBar();
                this.uiService.showAlertMessage('Email Verification Need!', 'Please verify your email first then login');
                return;
            }
            this.currentAuthUser = credential.user;
            // this.setAuthUserData(this.currentAuthUser, 'email');
            this.getUserCompleteFieldData(this.currentAuthUser).valueChanges()
                .subscribe(info => {
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            special: JSON.stringify(info)
                        }
                    };
                    const numberOfField = Object.keys(info).length;
                    this.uiService.hideLoadingBar();
                    if (numberOfField < 15) {
                        this.router.navigate(['profile-completion'], navigationExtras);
                    } else {
                        this.ngZone.run(() => {
                            this.router.navigate(['/']);
                        });
                    }
                });

        }).catch((error) => {
            this.uiService.hideLoadingBar();
            this.uiService.showAlertMessage('', error.message);
        });
  }
  // Sign up with email/password
  SignUp(email, password) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((credential) => {
            // Set User Data...
            this.currentAuthUser = credential.user;
            this.setAuthUserData(this.currentAuthUser, 'email');
            this.uiService.hideLoadingBar();

            // Sent Verification mail..
            this.SendVerificationMail();
            if (credential.user.emailVerified !== true) {
                this.SignOut();
            }
            // this.SetUserData(result.user);
        }).catch((error) => {
        this.uiService.hideLoadingBar();
        this.uiService.showAlertMessage('', error.message);
    });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    this.afAuth.auth.currentUser.sendEmailVerification()
        .then(() => {
            this.uiService.showAlertMessage('Email Verification Need!', 'Please verify your email first then login');
            this.router.navigate(['/login']);
        });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
         this.uiService.showToastMessage('Password reset email sent, check your inbox.');
        }).catch((error) => {
          this.uiService.showAlertMessage('Error', error.message);
        });
  }

  setAuthUserData(user, regWith) {
      if (!user) { return; }
      // console.log(user);
      const path = `Users/${user.uid}`;
      // const type = user.providerData.map(data => data.providerId);
      // let iPAddress;
      // this.getUserIPAddress().subscribe(info => iPAddress = info.ip);
      const userData: any = {
          uID: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // ipAddress: iPAddress,
          // phone: '',
          // points: '',
          role: 'user',
          registrationType: regWith,
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

    setUserExtraData(newData: any) {
        // const data = { [this.userData.uid]: newData };
        return this.db.object(`Users/${this.userData.uid}`).update(newData);
    }

    getUserCompleteFieldData(user) {
      return this.db.object(`Users/${user.uid}`);
    }

    // Sign in with Google
    GoogleAuth() {
        return this.AuthLogin(new auth.GoogleAuthProvider(), 'google');
    }
    // Sign in with Facebook
    FacebookAuth() {
        return this.AuthLogin(new auth.FacebookAuthProvider(), 'facebook');
    }


    // Auth logic to run auth providers
    AuthLogin(provider, regWith) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {

                // this.router.navigate(['messages'], navigationExtras);
                this.currentAuthUser = credential.user;
                this.setAuthUserData(this.currentAuthUser, regWith);
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
                                this.router.navigate(['/']);
                            });
                        }
                    });
                // this.SetUserData(result.user);
            }).catch((error) => {
                window.alert(error);
            });
    }

    // Sign out
    SignOut() {
        this.afAuth.auth.signOut().then(() => {
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
        });
    }

    loggedInUserInfo() {
        return this.userData;
    }

    getUserIPAddress() {
        return this.httpClient.get<any>('http://api.ipify.org/?format=json');
    }

    getNewLoggedInStatus(userID) {
        this.db.object(`Users/${userID}`);
    }

    myTestService() {
        const isF = true;
        const navigationExtras: NavigationExtras = {
            queryParams: {
                special: JSON.stringify(this.userInfoo)
            }
        };
        if (isF) {
            this.router.navigate(['profile-completion'], navigationExtras);
        } else {
            this.ngZone.run(() => {
                this.router.navigate(['/']);
            });
        }

    }


}
