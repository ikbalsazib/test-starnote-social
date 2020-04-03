import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Router, RouterEvent} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pages = [
    {
      title: 'Home',
      icon: 'home',
      url: '/'
    },
    {
      title: 'Services',
      icon: 'laptop',
      url: '/our-service'
    },
    {
      title: 'Courses',
      icon: 'albums',
      url: '/our-course'
    },
    {
      title: 'Video Tutorial',
      icon: 'desktop',
      url: ''
    },
    {
      title: 'Students',
      icon: 'school',
      url: ''
    },
    {
      title: 'Favourite',
      icon: 'heart',
      url: ''
    },
    {
      title: 'Themes',
      icon: 'color-palette',
      url: ''
    },
    {
      title: 'Contact Us',
      icon: 'mail',
      url: '/contact-us'
    },
    {
      title: 'About Us',
      icon: 'globe',
      url: '/about-us'
    },
    {
      title: 'Version',
      icon: 'logo-angular',
      url: ''
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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
    this.routerActiveDesign();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  routerActiveDesign() {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = this.router.url;
    });
  }
}
