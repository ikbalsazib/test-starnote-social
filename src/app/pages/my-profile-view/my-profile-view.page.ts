import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {UiService} from '../../services/ui.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserAuthService} from '../../services/user-auth.service';
import {UserPostService} from '../../services/user-post.service';
import {concatMap, last, map, take} from 'rxjs/operators';
import * as _ from 'lodash';
import {UserService} from '../../services/user.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {UserModel} from '../../interfaces/user-model';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
  selector: 'app-my-profile-view',
  templateUrl: './my-profile-view.page.html',
  styleUrls: ['./my-profile-view.page.scss'],
})
export class MyProfileViewPage implements OnInit, OnDestroy {
  private subscription: Subscription;

  sideLinks = [
    {
      title: 'Edit Profile',
      icon: 'pencil',
      url: '/edit-profile'
    },
    {
      title: 'Posts',
      icon: 'grid',
      url: '/all-posts'
    },
    {
      title: 'Friends',
      icon: 'people',
      url: '/all-friends'
    },
    {
      title: 'Groups',
      icon: 'chatbubbles',
      url: '/my-groups'
    },
    {
      title: 'Photos',
      icon: 'images',
      url: '/my-groups'
    },
    {
      title: 'Videos',
      icon: 'videocam',
      url: '/my-groups'
    },
    {
      title: 'About',
      icon: 'information-circle',
      url: '/my-groups'
    },
  ];

  userId: any;
  user: any;
  user$: Observable<any>;

  // Infinity Scroll..
  authId: any;
  limit = 2;
  postList: any;
  lastId: any;
  finishedLoading = false;

  // Profile Image Upload..
  isClickProfileImageChangeBtn = false;
  isClickCoverImageChangeBtn = false;
  @ViewChild('dialogTemplate', { static: true }) dialogTemplate: any;
  isLoaded = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imgBlob: any;
  fileBeforeCropped: any;

  // Cover Image Upload..
  @ViewChild('dialogCoverTemplate', { static: true }) dialogCoverTemplate: any;



  constructor(
      private uiService: UiService,
      private afAuth: AngularFireAuth,
      private userAuthService: UserAuthService,
      private userPostService: UserPostService,
      private userService: UserService,
      private storage: AngularFireStorage,
      private matDialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.subscription = this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        this.authId = auth.uid;
        this.userId = auth;
        this.getLastPostKey(auth.uid);
        this.getReasonsPosts(auth.uid);
        // this.userPosts$ = this.userPostService.getPostsByUser(auth.uid).valueChanges();
        // console.log(this.userPosts);
        this.user$ = this.userAuthService.getUserCompleteFieldData(this.userId).valueChanges();
      }
    });

  }

  onInfiniteScroll(event) {
    this.limit += 2; // or however many more you want to load
    setTimeout(() => {
      this.getReasonsPosts(this.authId );
      event.target.complete();
    }, 1000);
  }

  doRefresh(refresher?) {
    this.finishedLoading = false;
    setTimeout(() => {
      this.getReasonsPosts(this.authId );
      if (refresher) {
        refresher.target.complete();
      }
    }, 1000);
  }


  getLastPostKey(authId) {
    this.userPostService.getPostsByUserLastId(authId).snapshotChanges()
        .pipe(map(datas => datas.map(data => data.key)))
        .subscribe(key => this.lastId = key);
  }

  getReasonsPosts(authId) {
    this.subscription = this.userPostService.getPostsByUser(authId, this.limit).snapshotChanges()
        .pipe(
            map(datas => datas.map(data => ({ key: data.key, ...data.payload.val() }))),
            take(1)
        )
        .subscribe(keyData => {
          // Check New Post Added!!
          this.userPostService.isNewPostAdded.subscribe((data) => {
            if (data === true) {
              this.doRefresh();
            }
          });

          // Check Last Key...
          const lastKeyMap = keyData.map(data => data.key);
          let isLast;
          if (this.lastId) {
            isLast = _.includes(lastKeyMap, this.lastId[0]);
          }
          if (isLast) {
            this.finishedLoading = true;
            console.log('Finished...');
          }

          // Retrieve Post...
          this.postList = keyData;
        });
  }


  buttonClick() {
    this.uiService.showToastMessage('Coming Soon...');
  }

// <<<<<<<<<<< Image Upload >>>>>>>>>>>>>>
  fileProfileChangeEvent(event: any) {
    // Btn Logic..
    this.isClickProfileImageChangeBtn = true;
    this.isClickCoverImageChangeBtn = false;
    // Open Upload Dialog
    if (event.target.files[0]) {
      this.openProfileImgUploadDialog();
    }
    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }

  fileCoverChangeEvent(event: any) {
    // Btn Logic..
    this.isClickCoverImageChangeBtn = true;
    this.isClickProfileImageChangeBtn = false;
    // Open Upload Dialog
    if (event.target.files[0]) {
      this.openCoverImgUploadDialog();
    }
    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }

  openProfileImgUploadDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';
    // dialogConfig.maxHeight = '550px';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.matDialog.open(this.dialogTemplate, dialogConfig);
  }

  openCoverImgUploadDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.matDialog.open(this.dialogCoverTemplate, dialogConfig);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.fileBeforeCropped = this.imageChangedEvent.target.files[0];
    this.imgBlob = this.dataURItoBlob(this.croppedImage.split(',')[1]);
  }

  uploadProfileImage() {
    this.onCloseDialogue();
    this.uiService.showLoadingBar('Updating Your Profile...');
    const dbPath = `Crop_Images/${Date.now().toString()}_${this.fileBeforeCropped.name}`;

    // For Remove Old Stored Image...
    let oldUrl;
    this.userAuthService.getUserCompleteFieldData(this.userId).valueChanges()
        .subscribe(data => {
          // @ts-ignore
          oldUrl = data.imageThumbnail;
        });

    const readyFile = this.storage.upload(dbPath, this.imgBlob);
    readyFile.snapshotChanges()
        .pipe(
            last(),
            concatMap(() => this.storage.ref(dbPath).getDownloadURL())
        ).subscribe(uploadedUrl => {
      const newData = {
        imageHd: uploadedUrl,
        imageMedium: uploadedUrl,
        imageThumbnail: uploadedUrl
      };

      this.userService.updateUserData(this.authId, newData, oldUrl);
      this.uiService.hideLoadingBar();
    });
  }

  uploadCoverImage() {
    this.onCloseDialogue();
    this.uiService.showLoadingBar('Updating Your Profile...');
    const dbPath = `Cover_Images/${Date.now().toString()}_${this.fileBeforeCropped.name}`;
    // For Remove Old Stored Image...
    let oldUrl;
    this.userAuthService.getUserCompleteFieldData(this.userId).valueChanges()
        .subscribe(data => {
          // @ts-ignore
          oldUrl = data.coverImageHD;
        });

    const readyFile = this.storage.upload(dbPath, this.imgBlob);
    readyFile.snapshotChanges()
        .pipe(
            last(),
            concatMap(() => this.storage.ref(dbPath).getDownloadURL())
        ).subscribe(uploadedUrl => {
      const newData = {
        coverImageHD: uploadedUrl,
        coverImageThumb: uploadedUrl,
      };

      this.userService.updateUserData(this.authId, newData, oldUrl);
      this.uiService.hideLoadingBar();
      // console.log(uploadedUrl);
    });
  }


  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/jpeg'});
  }

  loadImageFailed() {
    this.matDialog.closeAll();
    // this.isLoaded = true;
  }

  cropperReady() {
    this.isLoaded = true;
  }

  onCloseDialogue() {
    this.matDialog.closeAll();
    this.isLoaded = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
