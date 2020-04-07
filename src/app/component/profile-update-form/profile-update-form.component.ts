import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {AngularFireStorage} from '@angular/fire/storage';
import {NgxImageCompressService} from 'ngx-image-compress';
import {UserAuthService} from '../../services/user-auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../services/ui.service';
import {concatMap, last} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {UserModel} from '../../interfaces/user-model';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {UserService} from '../../services/user.service';
import {PostModel} from '../../interfaces/post-model';

@Component({
  selector: 'app-profile-update-form',
  templateUrl: './profile-update-form.component.html',
  styleUrls: ['./profile-update-form.component.scss'],
})
export class ProfileUpdateFormComponent implements OnInit, OnDestroy {
    @Input() navigateUrl: string;
    private subscription: Subscription;
    // Responsive..
    mobileQuery: MediaQueryList;
    private mobileQueryListener: () => void;

    // Get User..
    userId: any;
    user: any;
    userInfo: UserModel;


    // Database Data..
    avatar = '../../../assets/svg/user-colored.svg';
    existsFirstName = '';
    existsLastName = '';
    existsEmail = '';
    existsPhone = '';
    existsBirthDate = '';
    existsBloodGroup = '';
    existsStudyInfo = '';
    existsProfilePic = '';
    existsAddress = '';
    disableEmailField = false;
    disablePhoneField = false;

    // Profile Image Upload..
    isClickProfileImageChangeBtn = false;
    isClickCoverImageChangeBtn = false;
    @ViewChild('imgCropperTemplate', { static: true }) imgCropperTemplate: any;
    isLoaded = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    imgBlob: any;
    fileBeforeCropped: any;

    // // Image Compress..
  // imgFilesUrl: string[] = [];
  // imgResultAfterCompress: string;
  // file: any;
  // localUrl: any;

  constructor(
      private changeDetectorRef: ChangeDetectorRef,
      private media: MediaMatcher,
      private storage: AngularFireStorage,
      private imageCompress: NgxImageCompressService,
      private afAuth: AngularFireAuth,
      private userAuthService: UserAuthService,
      private userService: UserService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private uiService: UiService,
      private matDialog: MatDialog
  ) {
    // Media Query...
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
      this.subscription = this.afAuth.authState.subscribe((auth) => {
          if (auth) {
              this.userId = auth.uid;
              this.user = auth;
              this.userAuthService.getUserCompleteFieldData(this.user).valueChanges()
                  .subscribe((userInfo: UserModel) => {
                      this.userInfo = userInfo;
                      if (userInfo !== null) {
                          this.completedUserField(this.userInfo);
                      }
                  });
          }
      });
  }

  // Complete Field...
  completedUserField(userInfo) {

      if (userInfo.displayName && !userInfo.firstName) {
          this.existsFirstName = userInfo.displayName;
      } else if (userInfo.firstName) {
          this.existsFirstName = userInfo.firstName;
      }

      if (userInfo.lastName) {
          this.existsLastName = userInfo.lastName;
      }

      if (userInfo.email) {
          this.existsEmail = userInfo.email;
      }

      if (userInfo.phone) {
          this.existsPhone = userInfo.phone;
      }

      if (userInfo.address) {
          this.existsAddress = userInfo.address;
      }

      if (userInfo.birthDate) {
          this.existsBirthDate = userInfo.birthDate;
      }

      if (userInfo.bloodGroup) {
          this.existsBloodGroup = userInfo.bloodGroup;
      }

      if (userInfo.studyInfo) {
          this.existsStudyInfo = userInfo.studyInfo;
      }


      if (userInfo.photoURL && !userInfo.imageThumbnail) {
          this.existsProfilePic = userInfo.photoURL;
      } else if (userInfo.imageThumbnail) {
          this.existsProfilePic = userInfo.imageThumbnail;
      }


      // Disable Field...
      if (userInfo.registrationType === 'google' || userInfo.registrationType === 'email') {
          this.disableEmailField = true;
      }

      if (userInfo.registrationType === 'phone') {
          this.disablePhoneField = true;
      }
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

    openProfileImgUploadDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '450px';
        // dialogConfig.maxHeight = '550px';
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.matDialog.open(this.imgCropperTemplate, dialogConfig);
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.fileBeforeCropped = this.imageChangedEvent.target.files[0];
        this.imgBlob = this.dataURItoBlob(this.croppedImage.split(',')[1]);
    }

    uploadProfileImage() {
        this.onCloseDialogue();
        this.uiService.showLoadingBar('Uploading Your Image...');
        const dbPath = `Crop_Images/${Date.now().toString()}_${this.fileBeforeCropped.name}`;

        // For Remove Old Stored Image...
        const oldUrl = this.userInfo.imageThumbnail;

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

            this.userService.updateUserData(this.userId, newData, oldUrl);
            this.uiService.hideLoadingBar();
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

  onSubmit(f: NgForm, navigateTo: string) {
    this.uiService.showLoadingBar('Updating Your Information...');

    const userData = {
        firstName: f.value.firstName,
        lastName: f.value.lastName,
        email: f.value.email,
        phone: f.value.phone,
        address: f.value.address,
        birthDate: f.value.birthDate,
        bloodGroup: f.value.bloodGroup,
        studyInfo: f.value.studyInfo,
        referCode: f.value.referCode,
    };

    this.userService.updateUserInfo(this.userId, userData)
          .then(completed => {
            f.reset();
            this.uiService.hideLoadingBar();
            this.router.navigate([navigateTo]);
          });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
      this.mobileQuery.removeListener(this.mobileQueryListener);
      this.uiService.hideLoadingBar();
  }

}
