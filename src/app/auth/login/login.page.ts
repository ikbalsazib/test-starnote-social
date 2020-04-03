import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {UiService} from '../../services/ui.service';
import {MenuController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  // Fragment...
  isPhoneLoginFragment = true;
  isLoginEmailFragment = false;
  isSignUpFragment = false;

  // Responsive..
  mobileQuery: MediaQueryList;
  ionMenuIsOpened: boolean;
  private mobileQueryListener: () => void;



  constructor(
      private userAuthService: UserAuthService,
      private changeDetectorRef: ChangeDetectorRef,
      private media: MediaMatcher,
      public menuCtrl: MenuController
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 699px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  // ionViewWillEnter() {
  //   this.menuCtrl.enable(false);
  // }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }


  // Fragment Logic.....
  onPhoneLoginFragment() {
    this.isPhoneLoginFragment = true;
    this.isLoginEmailFragment = false;
    this.isSignUpFragment = false;
  }

  onEmailLoginFragment() {
    this.isPhoneLoginFragment = false;
    this.isLoginEmailFragment = true;
    this.isSignUpFragment = false;
  }

  onSignUpFragment() {
    this.isPhoneLoginFragment = false;
    this.isLoginEmailFragment = false;
    this.isSignUpFragment = true;
  }

  onGoogleAuth() {
    this.userAuthService.GoogleAuth();
  }

  onFacebookAuth() {
    this.userAuthService.FacebookAuth();
  }

  ngOnDestroy(): void {
    this.menuCtrl.enable(true);
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
