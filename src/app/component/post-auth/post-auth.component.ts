import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'post-auth',
  templateUrl: './post-auth.component.html',
  styleUrls: ['./post-auth.component.scss'],
})
export class PostAuthComponent implements OnInit, OnDestroy {
  @Input() authorID: string;
  @Input() postDate: any;

  private subscription: Subscription;
  user: any;

  // Database..
  userRef: AngularFireObject<any>;
  userObservable: Observable<any>;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.userRef = this.db.object(`Users/${this.authorID}`);
    this.userObservable = this.userRef.valueChanges();

    this.subscription = this.userObservable.subscribe(data => {
      this.user = data;
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
