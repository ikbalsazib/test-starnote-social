import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserReactionService {
  userId: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth) { this.userId = auth.uid; }
    });
  }


  getReactions(postID): AngularFireObject<any> {
    return this.db.object(`Likes/${postID}`);
  }

  updateReaction(postID, reaction) {
    const data = { [this.userId]: reaction };
    this.db.object(`Likes/${postID}`).update(data);
  }

  removeReaction(postID) {
    this.db.object(`Likes/${postID}/${this.userId}`).remove();
  }

  countReactions(reactions: Array<any>) {
    return _.mapValues(_.groupBy(reactions), 'length');
  }

  userReaction(reactions: Array<any>) {
    return _.get(reactions, this.userId);
  }


}
