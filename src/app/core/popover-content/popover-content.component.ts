import { Component, OnInit } from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover-content',
  templateUrl: './popover-content.component.html',
  styleUrls: ['./popover-content.component.scss'],
})
export class PopoverContentComponent implements OnInit {
  pages = [
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

  // show and hide..
  showLeaderBoard = true;
  showFriends = true;

  constructor(private userAuthService: UserAuthService, public popoverController: PopoverController) { }

  ngOnInit() {
    if (window.innerWidth > 1279) {
      this.showLeaderBoard = false;
    }

    if (window.innerWidth > 842) {
      this.showFriends = false;
    }
  }

    onLogout() {
        this.userAuthService.SignOut();
        this.closePopover();
    }

  closePopover() {
    this.popoverController.dismiss();
  }
}
