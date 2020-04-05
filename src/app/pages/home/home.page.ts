import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Subscription} from 'rxjs';
import {UserAuthService} from '../../services/user-auth.service';
import {map, take} from 'rxjs/operators';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {UserPostService} from '../../services/user-post.service';
import {IonInfiniteScroll} from '@ionic/angular';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  // Media Query..
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  private subscription: Subscription;
  @ViewChild(IonInfiniteScroll, {static: true}) infinite: IonInfiniteScroll;
  limit = 2;
  postList: any;
  lastId: any;
  finishedLoading = false;

  constructor(
      private changeDetectorRef: ChangeDetectorRef,
      private media: MediaMatcher,
      private db: AngularFireDatabase,
      private userAuthService: UserAuthService,
      private router: Router,
      private userPostService: UserPostService
  ) {
    // Media Query...
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
      this.getLastPostKey();
      this.getReasonsPosts();
  }

    /*
  * New Method of Infinity Scroll...
  * Load Data from Angular Firebase Database
  * Pull to Refresh Added
  * Testing Mood
   */

  onInfiniteScroll(event) {
    console.log('Infinity Scroll started');
    this.limit += 2; // or however many more you want to load
    setTimeout(() => {
      this.getReasonsPosts();
      console.log('Infinity Scroll has ended');
      event.target.complete();
    }, 1000);
  }

  doRefresh(refresher?) {
    console.log('Begin async Refresher', refresher);
    this.finishedLoading = false;
    setTimeout(() => {
      this.getReasonsPosts();
      console.log('Async Refresher ended');
      if (refresher) {
        refresher.target.complete();
      }
    }, 1000);
  }

  getLastPostKey() {
    this.userPostService.getLastId().snapshotChanges()
        .pipe(map(datas => datas.map(data => data.key)))
        .subscribe(key => this.lastId = key);
  }

  getReasonsPosts() {
    this.subscription = this.userPostService.getPosts(this.limit).snapshotChanges()
        .pipe(
            map(datas => datas.map(data => ({ key: data.key, ...data.payload.val() }))),
            take(1)
        )
        .subscribe(keyData => {
          // Check New Post Added!!
          this.userPostService.isNewPostAdded.subscribe((data) => {
            if (data === true) {
              this.doRefresh();
            }
          });

          // Check Last Key...
          const lastKeyMap = keyData.map(data => data.key);
          const isLast = _.includes(lastKeyMap, this.lastId[0]);
          if (isLast) {
            this.finishedLoading = true;
            console.log('Finished...');
          }

          // Retrieve Post...
          this.postList = keyData;
        });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
