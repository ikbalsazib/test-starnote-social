import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {PostModel} from '../interfaces/post-model';
import {UiService} from './ui.service';
import {Router} from '@angular/router';
import {UserModel} from '../interfaces/user-model';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Movie} from '../interfaces/movie-model';
import {map, tap} from 'rxjs/operators';
import {error} from 'util';

const DB_PATH = '/Posts';

@Injectable({
  providedIn: 'root'
})
export class UserPostService {
  postRef: AngularFireList<PostModel> = null;
  userRef: AngularFireList<UserModel> = null;
  public isNewPostAdded = new Subject<boolean>();


  // Infinity Scroll..
    // tslint:disable-next-line:variable-name
  private _posts$ = new BehaviorSubject<PostModel[]>([]);
  batch = 2;
  lastKey = '';
  finished = false;

  constructor(private db: AngularFireDatabase, private uiService: UiService, private router: Router) {
    this.postRef = db.list(DB_PATH);
  }

  get posts$(): Observable<PostModel[]> {
    return this._posts$.asObservable();
  }

  nextPage(): Observable<PostModel[]> {
    if (this.finished) {
      console.log(this.finished);
      return this.posts$;
    }
    return this.getMovies(this.batch + 1, this.lastKey)
        .pipe(
            tap(movies => {

              // set the lastKey in preparation for next query
              this.lastKey = movies[movies.length - 1].key;
              const newMovies = movies.slice(0, this.batch);
              console.log(this.lastKey);

              // get current movies in BehaviorSubject
              const currentMovies = this._posts$.getValue();

              // if data is identical, stop making queries
              if (this.lastKey === newMovies[newMovies.length - 1].key) {
                this.finished = true;
              }

              this._posts$.next(currentMovies.concat(newMovies));
            })
        );
  }

  getMovies(batch: number, lastKey: string): Observable<PostModel[]> {
    return this.mapListKeys<PostModel>(
        this.db.list<PostModel>('/Posts', ref => {
          const query = ref.orderByKey().limitToFirst(batch);
          return (this.lastKey) ? query.startAt(this.lastKey) : query;
        })
    );
  }

  mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> {
    return list
        .snapshotChanges()
        .pipe(
            map(actions => actions.map(action => ({ key: action.key, ...action.payload.val() })))
        );
  }

  createNewPost(post: PostModel) {
    const postRefWithId = this.postRef.push(post);
    postRefWithId.update({ postID: postRefWithId.key })
        .then(() => {
        this.isNewPostAdded.next(true);
        this.uiService.hideLoadingBar();
        this.router.navigate(['/']);
        this.uiService.showToastMessage('Successfully Added your post');
    }).catch(err => {
        this.uiService.hideLoadingBar();
        this.uiService.showToastMessage('Something went wrong.');
    });
    // this.postRef.push(post).then(() => {
    //   this.uiService.hideLoadingBar();
    //   this.router.navigate(['/']);
    //   this.uiService.showToastMessage('Successfully Added your post');
    // });
  }

  getUserPostsList(): AngularFireList<PostModel> {
    return this.postRef;
  }

  getUserInfoById(userId) {
    this.userRef = this.db.list('users', ref => {
      return ref.orderByChild('uid').equalTo(userId);
    });

    return this.userRef;
  }

  /*
  * New Method of Infinity Scroll...
  * Load Data from Angular Firebase Database
  * Pull to Refresh Added
  * Testing Mood
   */

    getLastId() {
        return this.db.list('/Posts', ref => ref.limitToFirst(1));
    }

    getPosts(limit) {
        return this.db.list('/Posts', ref => ref.limitToLast(limit));
    }
}
