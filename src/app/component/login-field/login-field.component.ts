import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserAuthService} from '../../services/user-auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-field',
  templateUrl: './login-field.component.html',
  styleUrls: ['./login-field.component.scss'],
})
export class LoginFieldComponent implements OnInit {
  // Button Logic..
  isClickPhoneLoginBtn = true;
  isClickEmailLoginBtn = false;
  // Phone..
  phoneLoginForm: FormGroup;
  phone = new FormControl(null, {validators: [Validators.required]});

  // Email..
  emailLoginForm: FormGroup;
  email = new FormControl(null, {validators: [Validators.required, Validators.email]});
  password = new FormControl(null, {validators: [Validators.required]});

  constructor(private userAuthService: UserAuthService, private router:Router) { }

  ngOnInit() {
    // Phone Login Form..
    this.phoneLoginForm = new FormGroup({
      phone: this.phone
    });

    // Email Login Form..
    this.emailLoginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  // Button Logic's...
  emailLogin() {
    // Button Logic..
    this.isClickPhoneLoginBtn = false;
    this.isClickEmailLoginBtn = true;
  }
  phoneLogin() {
    // Button Logic..
    this.isClickPhoneLoginBtn = true;
    this.isClickEmailLoginBtn = false;
  }

  // User Sign In...
  onPhoneLogin() {
    if (this.phoneLoginForm.invalid) {
      return;
    }
    const phone = this.phoneLoginForm.value.phone;
    console.log(this.phoneLoginForm.value);
  }

  onEmailLogin() {
    if (this.emailLoginForm.invalid) {
      return;
    }
    const email = this.emailLoginForm.value.email;
    const password = this.emailLoginForm.value.password;
    this.userAuthService.SignIn(email, password);
  }

}
