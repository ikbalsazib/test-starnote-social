import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {BookModel} from '../interfaces/book-model';
import {Observable} from 'rxjs';

const DB_PATH = '/books/';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  bookRef: AngularFireList<BookModel> = null;
  bookQueryRef: AngularFireList<BookModel> = null;
  bookFindRef: AngularFireList<BookModel> = null;
  bookObservable: Observable<BookModel[]>;

  constructor(private db: AngularFireDatabase) {
    this.bookRef = db.list('books');
    this.bookQueryRef = db.list('books', ref => ref.limitToFirst(2));
    this.bookFindRef = db.list('books', ref => {
      return ref.orderByChild('author').equalTo('Ikbal');
    });
    this.bookObservable = this.bookRef.valueChanges();
  }

  createBook(newBook: BookModel, bookSlug: string) {
    return this.db.object(DB_PATH + bookSlug)
        .set(newBook);
  }

  updateBook(newTitle: string, slugId: string) {
    const book = {title: newTitle};
    return this.db.object(DB_PATH + slugId)
        .update(book);
  }

  deleteBook(slugId) {
    return this.db.object(DB_PATH + slugId)
        .remove();
  }

  getAllBook() {
    return this.bookRef;
  }

  queryBook() {
    return this.bookQueryRef;
  }

  findBooks() {
    return this.bookFindRef;
  }

}
