import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserAuthService} from '../../services/user-auth.service';
import {UiService} from '../../services/ui.service';

@Component({
  selector: 'app-signup-field',
  templateUrl: './signup-field.component.html',
  styleUrls: ['./signup-field.component.scss'],
})
export class SignupFieldComponent implements OnInit {

  // Email..
  emailSignUpForm: FormGroup;
  email = new FormControl(null, {validators: [Validators.required, Validators.email]});
  password = new FormControl(null, {validators: [Validators.required]});

  constructor(private userAuthService: UserAuthService, private uiService: UiService) { }

  ngOnInit() {

    // Email SignUp Form..
    this.emailSignUpForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }


  onEmailSignUp() {
    if (this.emailSignUpForm.invalid) {
      this.uiService.showToastMessage('Please complete all the required field.');
      return;
    }
    this.uiService.showLoadingBar(' Sign up Progressing...');
    const email = this.emailSignUpForm.value.email;
    const password = this.emailSignUpForm.value.password;
    this.userAuthService.SignUp(email, password);
  }

}
