import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserAuthService} from '../../services/user-auth.service';

@Component({
  selector: 'app-signup-field',
  templateUrl: './signup-field.component.html',
  styleUrls: ['./signup-field.component.scss'],
})
export class SignupFieldComponent implements OnInit {

  // Button Logic..
  isClickPhoneSignUpBtn = true;
  isClickEmailSignUpBtn = false;
  // Phone..
  phoneSignUpForm: FormGroup;
  phone = new FormControl(null, {validators: [Validators.required]});

  // Email..
  emailSignUpForm: FormGroup;
  email = new FormControl(null, {validators: [Validators.required, Validators.email]});
  password = new FormControl(null, {validators: [Validators.required]});

  constructor(private userAuthService: UserAuthService) { }

  ngOnInit() {
    // Phone SignUp Form..
    this.phoneSignUpForm = new FormGroup({
      phone: this.phone
    });

    // Email SignUp Form..
    this.emailSignUpForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  // Button Logic's...
  emailSignUp() {
    // Button Logic..
    this.isClickPhoneSignUpBtn = false;
    this.isClickEmailSignUpBtn = true;
  }
  phoneSignUp() {
    // Button Logic..
    this.isClickPhoneSignUpBtn = true;
    this.isClickEmailSignUpBtn = false;
  }

  // User Sign Up...
  onPhoneSignUp() {
    if (this.phoneSignUpForm.invalid) {
      return;
    }
    const phone = this.phoneSignUpForm.value.phone;
    console.log(this.phoneSignUpForm.value);
  }

  onEmailSignUp() {
    if (this.emailSignUpForm.invalid) {
      return;
    }
    const email = this.emailSignUpForm.value.email;
    const password = this.emailSignUpForm.value.password;
    this.userAuthService.SignUp(email, password);
  }

}
