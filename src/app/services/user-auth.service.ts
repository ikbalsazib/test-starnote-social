import {Injectable, NgZone} from '@angular/core';
import {auth} from 'firebase/app';
import {UserModel} from '../interfaces/user-model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {WindowService} from './window.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private dbPath = '/users';
  userRef: AngularFireList<UserModel> = null;
  currentUser: any;
  userData: any;
  windowRef: any;
    // private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
    private sent = false;

  constructor(
      private db: AngularFireDatabase,
      private afAuth: AngularFireAuth,
      private router: Router,
      private ngZone: NgZone,
      private windowService: WindowService
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

  // Sign in with email/password
  SignIn(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          if (result.user.emailVerified !== true) {
            this.SignOut();
            window.alert('Please verify your email first...');
            return;
          }
          this.ngZone.run(() => {
            console.log('Login Called');
            this.router.navigate(['/home']);
          });
          // this.SetUserData(result.user);
        }).catch((error) => {
          window.alert(error.message);
        });
  }
  // Sign up with email/password
  SignUp(email, password) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          this.SendVerificationMail();
          if (result.user.emailVerified !== true) {
            this.SignOut();
          }
          // this.SetUserData(result.user);
        }).catch((error) => {
          window.alert(error.message);
        });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    this.afAuth.auth.currentUser.sendEmailVerification()
        .then(() => {
          this.router.navigate(['/login']);
          window.alert('Please verify your email first..');
        });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          window.alert('Password reset email sent, check your inbox.');
        }).catch((error) => {
          window.alert(error);
        });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    // return (user !== null && user.emailVerified !== false);
    return (user !== null);
  }

  setAuthUserData(user) {
      if (!user) { return; }
      const path = `users/${user.uid}`;
      const userData: any = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
      };
      this.db.object(path).update(userData);
  }


  // SetUserData(user) {
  //   const userData: UserModel = {
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL
  //   };
  //   this.userRef.push(userData);
  // }

  // // Phone Sign In...
  //   PhoneAuth(phoneNum, appVerifier) {
  //       firebase.auth().signInWithPhoneNumber(phoneNum, appVerifier)
  //           .then((confirmationResult) => {
  //               this.sent = true;
  //               const verification = prompt('Enter verification code');
  //               if (verification != null) {
  //                   console.log(verification);
  //                   confirmationResult.confirm(verification)
  //                       .then((good) => {
  //                           // all checks out
  //                       })
  //                       .catch((bad) => {
  //                           // code verification was bad.
  //                       });
  //               } else {
  //                   console.log('No verification code entered');
  //               }
  //           })
  //           .catch((err) => {
  //               console.log('sms not sent', err);
  //           });
  //   }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Sign in with Facebook
  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }


  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
        .then((credential) => {
            const user = credential.user;
            this.setAuthUserData(user);
            this.ngZone.run(() => {
            this.router.navigate(['/home']);
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





  // createCustomer(user: UserModel): void {
  //   this.userRef.push(user);
  // }
  //
  //
  // getUsersList(): AngularFireList<UserModel> {
  //   return this.userRef;
  // }
  //
  // deleteUser(key: string): Promise<void> {
  //   return this.userRef.remove(key);
  // }
  //
  // // Sign up with email/password
  // userEmailSignUp(user: UserModel) {
  //   return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
  //       .then((userCredential) => {
  //           this.newUser = user;
  //           this.newUser.uid = userCredential.user.uid;
  //
  //           const data: UserModel = {
  //               uid: userCredential.user.uid,
  //               email: this.newUser.email,
  //               password: this.newUser.password,
  //               name: 'Sazib',
  //               photoURL: ''
  //           };
  //           this.createUserDatabase(data);
  //
  //           this.sendVerificationMail();
  //       }).catch((error) => {
  //           window.alert(error.message);
  //       });
  // }
  //
  // createUserDatabase(user: UserModel): void {
  //   this.userRef.push(user);
  // }
  //
  //   // Send email verification when new user sign up
  //   sendVerificationMail() {
  //     return this.afAuth.auth.currentUser.sendEmailVerification()
  //         .then(() => {
  //             this.router.navigate(['/login']);
  //             window.alert('Please validate your email address. Kindly check your inbox.');
  //         });
  //   }
  //
  //   // Sign in with email/password
  //   userEmailSignIn(email, password) {
  //       return this.afAuth.auth.signInWithEmailAndPassword(email, password)
  //           .then((result) => {
  //               if (result.user.emailVerified !== true) {
  //                   this.sendVerificationMail();
  //                   window.alert('Please validate your email address. Kindly check your inbox.');
  //               } else {
  //                   // this.router.navigate(['<!-- enter your route name here -->']);
  //               }
  //               // this.createUserDatabase(result.user);
  //           }).catch((error) => {
  //               window.alert(error.message);
  //           });
  //   }


}
