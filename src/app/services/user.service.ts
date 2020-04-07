import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase, private afs: AngularFireStorage) { }

  updateUserData(userId, newData: any, oldImageUrl) {
    return this.db.object(`Users/${userId}`).update(newData)
        .then(() => {
          if (oldImageUrl || oldImageUrl !== undefined) {
            this.afs.storage.refFromURL(oldImageUrl).delete();
          }
        });
  }

    updateUserInfo(userId, newData: any) {
        return this.db.object(`Users/${userId}`).update(newData);
    }

    getUserCompleteFieldData(userId) {
        return this.db.object(`Users/${userId}`);
    }
}
