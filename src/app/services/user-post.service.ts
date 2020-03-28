import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {PostModel} from '../interfaces/post-model';
import {UiService} from './ui.service';
import {Router} from '@angular/router';
import {UserModel} from '../interfaces/user-model';

const DB_PATH = '/Posts';

@Injectable({
  providedIn: 'root'
})
export class UserPostService {
  postRef: AngularFireList<PostModel> = null;
  userRef: AngularFireList<UserModel> = null;

  constructor(private db: AngularFireDatabase, private uiService: UiService, private router: Router) {
    this.postRef = db.list(DB_PATH);
  }

  createNewPost(post: PostModel) {
    const postRefWithId = this.postRef.push(post);
    postRefWithId.update({ postID: postRefWithId.key }).then(() => {
      this.uiService.hideLoadingBar();
      this.router.navigate(['/home']);
      this.uiService.showToastMessage('Successfully Added your post');
      console.log(postRefWithId.key);
    });
    // this.postRef.push(post).then(() => {
    //   this.uiService.hideLoadingBar();
    //   this.router.navigate(['/home']);
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
}
