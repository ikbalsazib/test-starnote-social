import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-sidebar-content',
  templateUrl: './mobile-sidebar-content.component.html',
  styleUrls: ['./mobile-sidebar-content.component.scss'],
})
export class MobileSidebarContentComponent implements OnInit {
  pages = [
    {
      title: 'Home',
      icon: 'home',
      url: ''
    },
    {
      title: 'Find Friends',
      icon: 'laptop',
      url: '/our-service'
    },
    {
      title: 'Groups',
      icon: 'albums',
      url: '/our-course'
    },
    {
      title: 'Friends Request',
      icon: 'desktop',
      url: '/ff'
    },
    {
      title: 'Apply For Teacher',
      icon: 'school',
      url: '/df'
    },
    {
      title: 'Wallet',
      icon: 'heart',
      url: '/dffs'
    },
    {
      title: 'Donate',
      icon: 'color-palette',
      url: '/ui'
    },
    {
      title: 'Quick Links',
      icon: 'globe',
      url: '/about-us'
    },
    {
      title: 'Settings',
      icon: 'globe',
      url: '/about-us'
    },
    {
      title: 'Contact Us',
      icon: 'mail',
      url: '/contact-us'
    },
    {
      title: 'Version',
      icon: 'logo-angular',
      url: '/po'
    }
  ];

  buttonLinks = [
    {
      title: 'Booking Service',
      icon: 'albums',
      url: '/service-booking'
    },
    {
      title: 'Apply for Course',
      icon: 'school',
      url: '/our-course/apply-for-course'
    },
    {
      title: 'Offers',
      icon: 'checkmark-circle',
      url: '/our-course/new-offer'
    },
    {
      title: 'Account',
      icon: 'person',
      url: '/login'
    }
  ];

  // For Active Design..
  selectedPath = '';

  constructor() { }

  ngOnInit() {}

}
