import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {BookModel} from '../../interfaces/book-model';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {UserAuthService} from '../../services/user-auth.service';
import {UserPostService} from '../../services/user-post.service';
import {map} from 'rxjs/operators';
import {PostModel} from '../../interfaces/post-model';
import * as moment from 'moment';
import { uniq, flatten } from 'lodash';
import {UserModel} from '../../interfaces/user-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private subscription: Subscription;
  postsList: PostModel[];
  userRef: AngularFireList<UserModel> = null;
  userObservable$: Observable<UserModel[] | null>;
  // hhh
    combinedPosts: Observable<any>;
  postRef: AngularFireList<PostModel> = null;

  constructor(
      private db: AngularFireDatabase,
      private userAuthService: UserAuthService,
      private userPostService: UserPostService
  ) { }

  ngOnInit() {
      // const fooPosts = this.db.list('users').valueChanges();
      // const barPosts = this.db.list('Posts').valueChanges();
      //
      // this.combinedPosts = combineLatest<any[]>(fooPosts, barPosts).pipe(
      //     map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
      // );
    // this.userRef = this.db.object('users/LNbnswBXzpPFu1kyAqZ19NaFkIf1');
    // this.userObservable$ = this.userRef.valueChanges();
      this.userRef = this.db.list('users');

      this.getPostsList();
  }

  getPostsList() {
    this.userPostService.getUserPostsList().snapshotChanges().pipe(
        map(blogPosts =>
            blogPosts.map(c => {
              return ({ key: c.payload.key, ...c.payload.val() });
                }
            ),
        )
    ).subscribe(result => this.postsList = result);

    // this.joined$ = this.db.list('users', ref => {
    //   return ref.orderByChild('uid').equalTo('LNbnswBXzpPFu1kyAqZ19NaFkIf1');
    // }).valueChanges();
  }

  findUser() {
      const fooPosts = this.db.list('users').valueChanges();
      const barPosts = this.db.list('Posts').valueChanges();

      const combinedList = combineLatest<any[]>(fooPosts, barPosts).pipe(
          map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
      );

      console.log(fooPosts);
      console.log(barPosts);
      console.log(combinedList);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

}
