import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  userId: string;
  emojiList = ['like', 'love', 'wow', 'haha', 'sad', 'angry'];

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth) { this.userId = auth.uid; }
    });
  }

  getReactions(itemId): AngularFireObject<any> {
    return this.db.object(`reactions/${itemId}`);
  }

  updateReaction(itemId, reaction= 0) {
    const data = { [this.userId]: reaction };
    this.db.object(`reactions/${itemId}`).update(data);
  }

  removeReaction(itemId) {
    this.db.object(`reactions/${itemId}/${this.userId}`).remove();
  }

  countReactions(reactions: Array<any>) {
    return _.mapValues(_.groupBy(reactions), 'length');
  }

  userReaction(reactions: Array<any>) {
    return _.get(reactions, this.userId);
  }



}
