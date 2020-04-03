import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Movie} from '../../interfaces/movie-model';
import {MovieService} from '../../services/movie.service';
import {IonInfiniteScroll, NavController} from '@ionic/angular';
import {map, take, tap} from 'rxjs/operators';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import * as _ from 'lodash';
@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.page.html',
  styleUrls: ['./scroll.page.scss'],
})
export class ScrollPage implements OnInit {
    @ViewChild(IonInfiniteScroll, {static: true}) infinite: IonInfiniteScroll;
    limit = 5;
    postList: any;
    lastId: any;
    finishedLoading = false;

  movies$: Observable<Movie[]>;

  constructor(public movieService: MovieService,
              public navCtrl: NavController, private db: AngularFireDatabase) { }


  ngOnInit() {
    //     this.loadMore();
    //     this.movies$ = this.movieService.movies$;
    // // this.movies$ = this.movieService.getMovies(4, '');
    //     console.log(this.movieService.movies$);
        this.getLastPostKey();
        this.getReasonsPosts();

  }


    // doInfinite(infiniteScroll): Promise<void> {
    //     if (!this.movieService.finished) {
    //         return new Promise((resolve, reject) => {
    //
    //             this.movieService.nextPage()
    //                 .pipe(take(1))
    //                 .subscribe(movies => {
    //                     console.log('Movies!', movies);
    //                     resolve();
    //                 });
    //
    //         });
    //     }
    //     return Promise.resolve();
    // }

    onAdd() {
      this.movieService.onAdd();
    }
    onInfiniteScroll(event) {
        console.log('Async started');
        this.limit += 8; // or however many more you want to load
        setTimeout(() => {
            this.getReasonsPosts();
            console.log('Async operation has ended');
            event.target.complete();
        }, 1000);
    }

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.finishedLoading = false;
        setTimeout(() => {
            this.getReasonsPosts();
            console.log('Async operation has ended');
            refresher.target.complete();
        }, 1000);
    }

    getLastPostKey() {
      this.movieService.getLastId().snapshotChanges()
          .pipe(map(datas => datas.map(data => data.key)))
          .subscribe(key => this.lastId = key);
    }

    getReasonsPosts() {
      this.movieService.getPosts(this.limit).snapshotChanges()
          .pipe(
              map(datas => datas.map(data => ({ key: data.key, ...data.payload.val() }))),
              take(1)
          )
          .subscribe(keyData => {
              const lastKeyMap = keyData.map(data => data.key);
              const isLast = _.includes(lastKeyMap, this.lastId[0]);
              if (isLast) {
                  this.finishedLoading = true;
                  console.log('Finished...');
              }
              // console.log(keyData);
              this.postList = keyData;
          });
    }

    loadMore(event?): Promise<void> {
        if (!this.movieService.finished) {
            return new Promise((resolve, reject) => {

                this.movieService.nextPage()
                    .pipe()
                    .subscribe(movies => {
                        console.log('Movies!', movies);
                        if (event) {
                            event.target.complete();
                        }
                        resolve();
                    });

            });
        } else {
            event.target.disabled = true;
            console.log('Finihed');
        }
        return Promise.resolve();
    }
}
