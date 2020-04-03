import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {BehaviorSubject, Observable} from 'rxjs';
import {Movie} from '../interfaces/movie-model';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private _movies$ = new BehaviorSubject<Movie[]>([]);
  batch = 3;
  lastKey = '';
  finished = false;

  constructor(private db: AngularFireDatabase) { }

  get movies$(): Observable<Movie[]> {
    return this._movies$.asObservable();
  }

  nextPage(): Observable<Movie[]> {
    if (this.finished) {
        console.log(this.finished);
        return this.movies$;
    }
    return this.getMovies(this.batch + 1, this.lastKey)
        .pipe(
            tap(movies => {

              // set the lastKey in preparation for next query
              this.lastKey = movies[movies.length - 1].key;
              const newMovies = movies.slice(0, this.batch);

              // get current movies in BehaviorSubject
              const currentMovies = this._movies$.getValue();

              // if data is identical, stop making queries
              if (this.lastKey === newMovies[newMovies.length - 1].key) {
                this.finished = true;
              }

              this._movies$.next(currentMovies.concat(newMovies));
            })
        );
  }

   getMovies(batch: number, lastKey: string): Observable<Movie[]> {
    return this.mapListKeys<Movie>(
        this.db.list<Movie>('/movies', ref => {
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

    onAdd() {
        const data = {
            title : `Movie ${Date.now()}`,
            year: 2000
        };
        this.db.list('movies').push(data);
    }

    getLastId() {
        return this.db.list('/movies', ref => ref.limitToFirst(1));
    }

    getPosts(limit) {
        return this.db.list('/movies', ref => ref.limitToLast(limit));
    }

}
