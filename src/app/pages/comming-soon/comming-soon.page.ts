import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-comming-soon',
  templateUrl: './comming-soon.page.html',
  styleUrls: ['./comming-soon.page.scss'],
})
export class CommingSoonPage implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(
      private changeDetectorRef: ChangeDetectorRef,
      private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
