import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserAuthService} from '../../services/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Fragment...
  isLoginFragment = true;
  isSignUpFragment = false;

  usersList: any;
  reactiveForm: FormGroup;

  email = new FormControl(null, {validators: [Validators.required, Validators.email]});
  password = new FormControl(null, {validators: [Validators.required]});


  constructor(private userAuthService: UserAuthService) { }

  ngOnInit() {
    // this.getUsersList();
    // this.authService.initAuthListener();
    this.reactiveForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  getUsersList() {
    // this.userService.getUsersList().snapshotChanges().pipe(
    //     map(changes =>
    //         changes.map(c =>
    //             ({ key: c.payload.key, ...c.payload.val() })
    //         )
    //     )
    // ).subscribe(users => {
    //   this.usersList = users;
    // });
  }

  removeUser(key: any) {
    // this.userService.deleteUser(key)
    //     .then(() => console.log('Success'));
  }

  // Fragment Logic.....
  onLoginFragment() {
    this.isLoginFragment = true;
    this.isSignUpFragment = false;
  }

  onSignUpFragment() {
    this.isLoginFragment = false;
    this.isSignUpFragment = true;
  }

    onGoogleAuth() {
        this.userAuthService.GoogleAuth();
    }

  onFacebookAuth() {
    this.userAuthService.FacebookAuth();
  }
}
