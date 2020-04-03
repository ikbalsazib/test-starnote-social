import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

const USER = JSON.parse(localStorage.getItem('user'));

@Component({
  selector: 'profile-short-view',
  templateUrl: './profile-short.component.html',
  styleUrls: ['./profile-short.component.scss'],
})
export class ProfileShortComponent implements OnInit, OnDestroy {
  userId: any;
  user: any;
  user$: Observable<any>;
  subscription: Subscription;
  @ViewChild('dialougeTemplate', { static: true }) dialougeTemplate: any;
  reactiveForm: FormGroup;

  // User Profile Data..
  userCompletedInfo: any;

  // Form Value..
  phone = new FormControl(null);
  email = new FormControl(null, {validators: [Validators.email]});
  address = new FormControl(null);

  constructor(
      private userAuthService: UserAuthService,
      private afAuth: AngularFireAuth,
      private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        this.userId = auth;
        this.user$ = this.userAuthService.getUserCompleteFieldData(this.userId).valueChanges();
      }
    });
    // this.subscription = this.userAuthService.getUserCompleteFieldData(this.userId).valueChanges()
    //     .subscribe(completedData => {
    //       console.log(completedData);
    //       this.userCompletedInfo = completedData;
    //     });

    this.reactiveForm = new FormGroup(
        {
          phone: this.phone,
          email: this.email,
          address: this.address
        }
    );
  }

  onUpdateProfileInfo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.matDialog.open(this.dialougeTemplate, dialogConfig);
  }

  onCancel() {
    this.matDialog.closeAll();
    // this.reactiveForm.reset();
  }

  onSubmitForm() {
    const user = JSON.parse(localStorage.getItem('user'));
    const data = {
      email: this.userCompletedInfo.email === undefined ? this.reactiveForm.value.email : this.userCompletedInfo.email,
      phone: this.userCompletedInfo.phone === undefined ? this.reactiveForm.value.phone : this.userCompletedInfo.phone,
      address: this.userCompletedInfo.address === undefined ? this.reactiveForm.value.address : this.userCompletedInfo.address,
    };
    this.userAuthService.setUserExtraData(data);
    this.matDialog.closeAll();

    // console.log(this.reactiveForm.value);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

}
