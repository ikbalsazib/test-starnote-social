import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from '../../interfaces/user-model';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserAuthService} from '../../services/user-auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-mobile-sidebar-content',
  templateUrl: './mobile-sidebar-content.component.html',
  styleUrls: ['./mobile-sidebar-content.component.scss'],
})
export class MobileSidebarContentComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  pages = [
    {
      title: 'Home',
      icon: '../../../assets/icon/ic_home_new.svg',
      url: ''
    },
    {
      title: 'Find Friends',
      icon: '../../../assets/icon/ic_add_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Groups',
      icon: '../../../assets/icon/ic_group_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Friends Request',
      icon: '../../../assets/icon/ic_add_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Apply For Teacher',
      icon: '../../../assets/icon/ic_dictionary_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Wallet',
      icon: '../../../assets/icon/ic_wallet_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Donate',
      icon: '../../../assets/icon/ic_donate_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Quick Links',
      icon: '../../../assets/icon/ic_link_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Settings',
      icon: '../../../assets/icon/ic_settings_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Feedback',
      icon: '../../../assets/icon/ic_send_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'Contact Us',
      icon: '../../../assets/icon/ic_star_new.svg',
      url: '/coming-soon'
    },
    {
      title: 'About Us',
      icon: '../../../assets/icon/ic_about_us.svg',
      url: '/coming-soon'
    }
  ];

  // For Active Design..
  selectedPath = '';
  // Get User...
  user: any;
  userInfo: UserModel;

  constructor(
      private afAuth: AngularFireAuth,
      private userAuthService: UserAuthService
  ) { }

  ngOnInit() {
    this.subscription = this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        this.user = auth;
        this.userAuthService.getUserCompleteFieldData(this.user).valueChanges()
            .subscribe((userInfo: UserModel) => {
              this.userInfo = userInfo;
            });
      }
    });
  }

  onLogout() {
    this.userAuthService.SignOut();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
