import { Component, OnInit } from '@angular/core';
import {TestService} from '../../services/test.service';
import {BehaviorSubject, Observable} from 'rxjs';
import * as _ from 'lodash';
import {map, take, tap} from 'rxjs/operators';
import {BookModel} from '../../interfaces/book-model';
import {AngularFireList} from '@angular/fire/database';

@Component({
  selector: 'app-test-two',
  templateUrl: './test-two.page.html',
  styleUrls: ['./test-two.page.scss'],
})
export class TestTwoPage implements OnInit {
  movies = new BehaviorSubject([]);
  batch = 2;       // size of each query
  lastKey = '';     // key to offset from
  ready = true;     // ready to fire new query?
  finished = false; // end of list to prevent duplicate queries

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.getMovies();
  }

  getMoreMovies() {
    this.getMovies(this.lastKey);
  }

  getMovies(lastKey?) {
    this.testService.getBooks(this.batch + 1, lastKey)
        .pipe(tap(movies => {

              this.lastKey = movies[movies.length - 1].key;
              const newMovies = movies.slice(0, this.batch);
              const currentMovies = this.movies.getValue();

              if (this.lastKey === newMovies[newMovies.length - 1].key) {
                this.finished = true;
              }

              this.movies.next(currentMovies.concat(newMovies));

              // const batchLastKey = _.last(movies)['$key'];
              // console.log(this.lastKey || 'none', batchLastKey);
              // if (batchLastKey === this.lastKey) {
              //   this.finished = true;
              // }
              //
              // this.lastKey = batchLastKey;
            }), take(1)
        ).subscribe(movies => {
          console.log(movies);
          this.ready = true;
    });
  }



  // getMovies(lastKey?) {
  //   this.testService.getBooks(this.batch + 1, lastKey)
  //       .pipe(tap(movies => {
  //
  //         console.log(movies);
  //
  //         const batchLastKey = _.last(movies)['$key'];
  //         console.log(this.lastKey || 'none', batchLastKey);
  //         if (batchLastKey === this.lastKey) {
  //           this.finished = true;
  //         }
  //
  //         this.lastKey = batchLastKey;
  //       }), map(movies => _.slice(movies, 0, this.batch) )
  //       ).subscribe(movies => {
  //     // if (this.finished) return;
  //
  //     const current = this.movies.getValue();
  //     this.movies.next( _.concat(current, movies) );
  //     this.ready = true;
  //   });
  // }


  onAdd() {
    const p = [];
    const book: BookModel = {
      title: `My Title(${Date.now()}) `,
      content: 'Iam a test book!!',
      author: 'Ikbal Sazib'
    };
    p.push(book);

    this.testService.createBook(book, '');
  }

  loadPokemons(event?) {
    console.log('Scrolling...');
    this.getMovies();

  }

  onTest() {
    const array = [
      {name: 'Sazib1', age: 21},
      {name: 'Sazib2', age: 21},
      {name: 'Sazib3', age: 21},
      {name: 'Sazib4', age: 21},
      {name: 'Sazib5', age: 21},
      {name: 'Sazib6', age: 21},
      {name: 'Sazib7', age: 21},
      {name: 'Sazib8', age: 21},
    ];
    const newArray = _.slice(array, 0, 5);

    console.log(array);
    console.log(newArray);
  }
}
