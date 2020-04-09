import {ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {MenuController, PopoverController} from '@ionic/angular';
import {Router, RouterEvent} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {PopoverContentComponent} from '../core/popover-content/popover-content.component';

@Component({
  selector: 'star-toolbar',
  templateUrl: './star-toolbar.page.html',
  styleUrls: ['./star-toolbar.page.scss'],
})
export class StarToolbarPage implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  ionMenuIsOpened: boolean;

  // For Active Design..
  selectedPath = '';
  private mobileQueryListener: () => void;

  // show and hide..
  showLeaderBoard = false;
  showFriends = false;


  constructor(
      public menuCtrl: MenuController,
      private router: Router,
      private changeDetectorRef: ChangeDetectorRef,
      private media: MediaMatcher,
      public popoverController: PopoverController
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    this.routerActiveDesign();
  }


  ngOnInit() {
    if (window.innerWidth > 1279) {
      this.showLeaderBoard = true;
    }

    if (window.innerWidth > 842) {
      this.showFriends = true;
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverContentComponent,
      event: ev,
      translucent: true,
      cssClass: 'customPopover'
    });
    return await popover.present();
  }

  routerActiveDesign() {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = this.router.url;
    });
  }


  toggleMenu() {
    this.menuCtrl.toggle();
  }


  showSearch() {
    this.menuCtrl.toggle('searchMenu');
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
