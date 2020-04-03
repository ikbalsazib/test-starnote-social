import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {BookModel} from '../interfaces/book-model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, take} from 'rxjs/operators';
import {Movie} from '../interfaces/movie-model';

const DB_PATH = '/books/';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  bookRef: AngularFireList<BookModel> = null;
  bookQueryRef: AngularFireList<BookModel> = null;
  bookFindRef: AngularFireList<BookModel> = null;
  bookObservable: Observable<BookModel[]>;

  baseUrl = 'https://pokeapi.co/api/v2';
  imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  constructor(private db: AngularFireDatabase, private http: HttpClient) {
    this.bookRef = db.list('books');
    this.bookQueryRef = db.list('books', ref => ref.limitToFirst(2));
    this.bookFindRef = db.list('books', ref => {
      return ref.orderByChild('author').equalTo('Ikbal');
    });
    this.bookObservable = this.bookRef.valueChanges();
  }

  getPokemon(offset = 0) {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=25`)
        .pipe(
            map(result => {
          // @ts-ignore
              return result.results;
        }),
            map(pokemons => {
              return pokemons.map((poke, index) => {
                poke.image = this.getPokeImage(index + offset + 1);
                poke.pokeIndex = offset + index + 1;
                return poke;
              });
            })
        );
  }

  getPosts(limit) {
    return this.db.list('books', ref => ref.limitToLast(limit));
  }

  getLastId() {
    return this.db.list('books', ref => ref.limitToFirst(1));
  }

  getPokeImage(index) {
    return `${this.imageUrl}${index}.png`;
  }

  createBook(newBook: BookModel, bookSlug: string) {
    return this.db.list('books').push(newBook);
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

  getBooks(limit, key?) {
    return this.mapListKeys<any>(
        this.db.list<any>('/books', ref => {
          const query = ref.orderByKey().limitToFirst(limit);
          return (key) ? query.startAt(key) : query;
        })
    );

    // return this.db.list('/books', ref => {
    //   if (key) {
    //     return ref.startAt(key);
    //   }
    //   return ref.orderByKey().limitToFirst(limit);
    // });
  }

  mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> {
    return list
        .snapshotChanges()
        .pipe(
            map(actions => actions.map(action => ({ key: action.key, ...action.payload.val() })))
        );
  }

  // getCombinedPosts() {
  //     const queryUser = (authorId) => {
  //         return this.userRef = this.db.list('Users', ref => ref.orderByChild('uID').equalTo(authorId));
  //     };
  //
  //     this.postRef = this.db.list('Posts');
  //
  //     this.combinedPosts$ = this.postRef.valueChanges().pipe(
  //         switchMap(blogPosts => {
  //             const authorIds = uniq(blogPosts.map(bp => bp.authorID));
  //             const postIds = uniq(blogPosts.map(bp => bp.postID));
  //
  //             return combineLatest(
  //                 of(blogPosts),
  //                 combineLatest(
  //                     authorIds.map(
  //                         authorId => queryUser(authorId)
  //                             .valueChanges().pipe(map(authors => authors[0]))
  //                     )
  //                 )
  //             );
  //         }), map(([blogPosts, authors]) => {
  //             return blogPosts.map(blogPost => {
  //                 return {
  //                     ...blogPost,
  //                     // @ts-ignore
  //                     author: authors.find(a => a.uID === blogPost.authorID)
  //                 };
  //             });
  //         })
  //     );
  // }

  // getPostsList() {
  //   this.subscription = this.userPostService.getUserPostsList().snapshotChanges().pipe(
  //       map(blogPosts =>
  //           blogPosts.map(c => {
  //                 return ({ key: c.payload.key, ...c.payload.val() });
  //               }
  //           ),
  //       )
  //   ).subscribe(result => this.postsList = result);
  // }


  loadMore(event?) {
    // this.userPostService.nextPage()
    //     .pipe(take(1))
    //     .subscribe(movies => {
    //         console.log('Movies!', movies);
    //         if (event) {
    //             event.target.complete();
    //         }
    //     });
    //   if (!this.userPostService.finished) {
    //     return new Promise((resolve, reject) => {
    //
    //       this.userPostService.nextPage()
    //           .pipe(take(1))
    //           .subscribe(movies => {
    //             console.log('Movies!', movies);
    //             if (event) {
    //               event.target.complete();
    //             }
    //             resolve();
    //           });
    //
    //     });
    //   } else {
    //     event.target.disabled = true;
    //     console.log('Finihed');
    //   }
    //   return Promise.resolve();
    // }


    // SetUserData(user) {
    //   const userData: UserModel = {
    //     uid: user.uid,
    //     email: user.email,
    //     displayName: user.displayName,
    //     photoURL: user.photoURL
    //   };
    //   this.userRef.push(userData);
    // }

    // // Phone Sign In...
    //   PhoneAuth(phoneNum, appVerifier) {
    //       firebase.auth().signInWithPhoneNumber(phoneNum, appVerifier)
    //           .then((confirmationResult) => {
    //               this.sent = true;
    //               const verification = prompt('Enter verification code');
    //               if (verification != null) {
    //                   console.log(verification);
    //                   confirmationResult.confirm(verification)
    //                       .then((good) => {
    //                           // all checks out
    //                       })
    //                       .catch((bad) => {
    //                           // code verification was bad.
    //                       });
    //               } else {
    //                   console.log('No verification code entered');
    //               }
    //           })
    //           .catch((err) => {
    //               console.log('sms not sent', err);
    //           });
    //   }


    // createCustomer(user: UserModel): void {
    //   this.userRef.push(user);
    // }
    //
    //
    // getUsersList(): AngularFireList<UserModel> {
    //   return this.userRef;
    // }
    //
    // deleteUser(key: string): Promise<void> {
    //   return this.userRef.remove(key);
    // }
    //
    // // Sign up with email/password
    // userEmailSignUp(user: UserModel) {
    //   return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
    //       .then((userCredential) => {
    //           this.newUser = user;
    //           this.newUser.uid = userCredential.user.uid;
    //
    //           const data: UserModel = {
    //               uid: userCredential.user.uid,
    //               email: this.newUser.email,
    //               password: this.newUser.password,
    //               name: 'Sazib',
    //               photoURL: ''
    //           };
    //           this.createUserDatabase(data);
    //
    //           this.sendVerificationMail();
    //       }).catch((error) => {
    //           window.alert(error.message);
    //       });
    // }
    //
    // createUserDatabase(user: UserModel): void {
    //   this.userRef.push(user);
    // }
    //
    //   // Send email verification when new user sign up
    //   sendVerificationMail() {
    //     return this.afAuth.auth.currentUser.sendEmailVerification()
    //         .then(() => {
    //             this.router.navigate(['/login']);
    //             window.alert('Please validate your email address. Kindly check your inbox.');
    //         });
    //   }
    //
    //   // Sign in with email/password
    //   userEmailSignIn(email, password) {
    //       return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    //           .then((result) => {
    //               if (result.user.emailVerified !== true) {
    //                   this.sendVerificationMail();
    //                   window.alert('Please validate your email address. Kindly check your inbox.');
    //               } else {
    //                   // this.router.navigate(['<!-- enter your route name here -->']);
    //               }
    //               // this.createUserDatabase(result.user);
    //           }).catch((error) => {
    //               window.alert(error.message);
    //           });
    //   }

  }
}
