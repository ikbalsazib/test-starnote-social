import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserModel} from '../../interfaces/user-model';

const USER = JSON.parse(localStorage.getItem('user'));

@Component({
  selector: 'profile-short-view',
  templateUrl: './profile-short.component.html',
  styleUrls: ['./profile-short.component.scss'],
})
export class ProfileShortComponent implements OnInit {
  userId: any;
  user: any;
  user$: Observable<any>;

  constructor(
      private userAuthService: UserAuthService,
      private afAuth: AngularFireAuth,
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        this.userId = auth;
        this.user$ = this.userAuthService.getUserCompleteFieldData(this.userId).valueChanges();
      }
    });

  }

}
