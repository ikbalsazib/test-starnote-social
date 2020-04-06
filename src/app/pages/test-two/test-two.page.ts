import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {map, take} from 'rxjs/operators';
import {UiService} from '../../services/ui.service';
import {UserPostService} from '../../services/user-post.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable, Subscription} from 'rxjs';
import {UserAuthService} from '../../services/user-auth.service';

@Component({
  selector: 'app-test-two',
  templateUrl: './test-two.page.html',
  styleUrls: ['./test-two.page.scss'],
})
export class TestTwoPage implements OnInit, OnDestroy {
  private subscription: Subscription;

  sideLinks = [
    {
      title: 'Edit Profile',
      icon: 'pencil',
      url: '/edit-profile'
    },
    {
      title: 'Posts',
      icon: 'grid',
      url: '/all-posts'
    },
    {
      title: 'Friends',
      icon: 'people',
      url: '/all-friends'
    },
    {
      title: 'Groups',
      icon: 'chatbubbles',
      url: '/my-groups'
    },
    {
      title: 'Photos',
      icon: 'images',
      url: '/my-groups'
    },
    {
      title: 'Videos',
      icon: 'videocam',
      url: '/my-groups'
    },
    {
      title: 'About',
      icon: 'information-circle',
      url: '/my-groups'
    },
  ];

  userId: any;
  user: any;
  user$: Observable<any>;

  // Infinity Scroll..
  authId: any;
  limit = 2;
  postList: any;
  lastId: any;
  finishedLoading = false;


  constructor(
      private uiService: UiService,
      private afAuth: AngularFireAuth,
      private userAuthService: UserAuthService,
      private userPostService: UserPostService
  ) {
  }

  ngOnInit() {
    this.subscription = this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        this.authId = auth.uid;
        this.userId = auth;
        this.getLastPostKey(auth.uid);
        this.getReasonsPosts(auth.uid);
        // this.userPosts$ = this.userPostService.getPostsByUser(auth.uid).valueChanges();
        // console.log(this.userPosts);
        this.user$ = this.userAuthService.getUserCompleteFieldData(this.userId).valueChanges();
      }
    });
  }

  onInfiniteScroll(event) {
    console.log('Infinity Scroll started');
    this.limit += 2; // or however many more you want to load
    setTimeout(() => {
      this.getReasonsPosts(this.authId );
      console.log('Infinity Scroll has ended');
      event.target.complete();
    }, 1000);
  }

  doRefresh(refresher?) {
    console.log('Begin async Refresher', refresher);
    this.finishedLoading = false;
    setTimeout(() => {
      this.getReasonsPosts(this.authId );
      console.log('Async Refresher ended');
      if (refresher) {
        refresher.target.complete();
      }
    }, 1000);
  }


  getLastPostKey(authId) {
    this.userPostService.getPostsByUserLastId(authId).snapshotChanges()
        .pipe(map(datas => datas.map(data => data.key)))
        .subscribe(key => this.lastId = key);
  }

  getReasonsPosts(authId) {
    this.subscription = this.userPostService.getPostsByUser(authId, this.limit).snapshotChanges()
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


  buttonClick() {
    this.uiService.showToastMessage('Coming Soon...');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
