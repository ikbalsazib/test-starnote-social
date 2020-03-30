import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {UserAuthService} from '../../services/user-auth.service';
import {map, switchMap} from 'rxjs/operators';
import {PostModel} from '../../interfaces/post-model';
import { uniq } from 'lodash';
import {UserModel} from '../../interfaces/user-model';
import {CombinedPostModel} from '../../interfaces/combined-post-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private subscription: Subscription;
  // postsList: PostModel[];
  userRef: AngularFireList<UserModel> = null;
  postRef: AngularFireList<PostModel> = null;
  combinedPosts$: Observable<any>;

  constructor(
      private db: AngularFireDatabase,
      private userAuthService: UserAuthService,
      // private userPostService: UserPostService
  ) { }

  ngOnInit() {
      this.getCombinedPosts();
  }

  getCombinedPosts() {
      const queryUser = (authorId) => {
          return this.userRef = this.db.list('Users', ref => ref.orderByChild('uID').equalTo(authorId));
      };

      this.postRef = this.db.list('Posts');

      this.combinedPosts$ = this.postRef.valueChanges().pipe(
          switchMap(blogPosts => {
              const authorIds = uniq(blogPosts.map(bp => bp.authorID));
              const postIds = uniq(blogPosts.map(bp => bp.postID));

              return combineLatest(
                  of(blogPosts),
                  combineLatest(
                      authorIds.map(
                          authorId => queryUser(authorId)
                              .valueChanges().pipe(map(authors => authors[0]))
                      )
                  )
              );
          }), map(([blogPosts, authors]) => {
              return blogPosts.map(blogPost => {
                  return {
                      ...blogPost,
                      // @ts-ignore
                      author: authors.find(a => a.uID === blogPost.authorID)
                  };
              });
          })
      );
  }


    //   getPostsList() {
    //       this.userPostService.getUserPostsList().snapshotChanges().pipe(
    //           map(blogPosts =>
    //               blogPosts.map(c => {
    //                       return ({ key: c.payload.key, ...c.payload.val() });
    //                   }
    //               ),
    //           )
    //       ).subscribe(result => this.postsList = result);
    //
    //       // this.joined$ = this.db.list('users', ref => {
    //       //   return ref.orderByChild('uID').equalTo('LNbnswBXzpPFu1kyAqZ19NaFkIf1');
    //       // }).valueChanges();
    //   }

    ngOnDestroy(): void {
        // this.subscription.unsubscribe();
    }
}
