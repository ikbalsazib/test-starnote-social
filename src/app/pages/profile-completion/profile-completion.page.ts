import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {NgxImageCompressService} from 'ngx-image-compress';
import {UserAuthService} from '../../services/user-auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../services/ui.service';
import {concatMap, last} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-profile-completion',
  templateUrl: './profile-completion.page.html',
  styleUrls: ['./profile-completion.page.scss'],
})
export class ProfileCompletionPage implements OnInit, OnDestroy {
    // Responsive..
    mobileQuery: MediaQueryList;
    private mobileQueryListener: () => void;

    // Databae Data..
    data = null;
    avatar = '../../../assets/svg/user-colored.svg';
    existsName = '';
    existsEmail = '';
    existsPhone = '';
    existsProfilePic = '';
    existsAddress = '';

    // Image Compress..
    imgFilesUrl: string[] = [];
    imgResultAfterCompress: string;
    file: any;
    localUrl: any;

  constructor(
      private changeDetectorRef: ChangeDetectorRef,
      private media: MediaMatcher,
      private storage: AngularFireStorage,
      private imageCompress: NgxImageCompressService,
      private userAuthService: UserAuthService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private uiService: UiService
  ) {
      // Media Query...
      this.mobileQuery = media.matchMedia('(max-width: 768px)');
      this.mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this.mobileQueryListener);

      // Query Param...
      this.activatedRoute.queryParams
          .subscribe(params => {
              if (params && params.special) {
                  this.data = JSON.parse(params.special);
              }
          });
  }

  ngOnInit() {
    if (this.data !== null) {

        if (this.data.displayName) {
            this.existsName = this.data.displayName;
        }

        if (this.data.name) {
            this.existsName = this.data.name;
        }

        if (this.data.email) {
            this.existsEmail = this.data.email;
        }

        if (this.data.phone) {
            this.existsPhone = this.data.phone;
        }

        if (this.data.photoURL) {
            this.existsProfilePic = this.data.photoURL;
        }

        if (this.data.imageMedium) {
            this.existsProfilePic = this.data.imageMedium;
        }

        if (this.data.address) {
            this.existsAddress = this.data.address;
        }

    }
  }

    // For Image Upload...
    onImageUpload(event: any) {
        const file: File = (event.target as HTMLInputElement).files[0];
        this.uiService.showLoadingBar('Uploading...');
        const fileName = `${new Date().getTime().toString()}_${file.name}`;
        const ThumbFilePath = `User_Images/thumb_${fileName}`;

        // For Compress....
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            // tslint:disable-next-line:no-shadowed-variable
            reader.onload = (event: any) => {
                this.localUrl = event.target.result;
                this.compressFile(this.localUrl, ThumbFilePath);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    compressFile(imageThumb, ThumbFilePath) {
        const orientation = -1;
        this.imageCompress.compressFile(imageThumb, orientation, 30, 50).then(
            result => {
                this.imgResultAfterCompress = result;
                // Recompile Image as a File...
                const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);

                const readyFile = this.storage.upload(ThumbFilePath, imageBlob);

                readyFile.snapshotChanges()
                    .pipe(
                        last(),
                        concatMap(() => this.storage.ref(ThumbFilePath).getDownloadURL())
                    ).subscribe(res => {
                    this.existsProfilePic = res;
                    this.uiService.hideLoadingBar();
                });

            });
    }

    // Array Buffer Code to Image....
    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([int8Array], {type: 'image/jpeg'});
    }

  onSubmit(f: NgForm) {
      this.uiService.showLoadingBar('Updating Information...');

      const userData = {
          name: f.value.name,
          email: f.value.email,
          phone: f.value.phone,
          address: f.value.address,
          birthDate: f.value.birthDate,
          imageHd: this.existsProfilePic,
          imageMedium: this.existsProfilePic,
          imageThumbnail: this.existsProfilePic
      };

      this.userAuthService.setUserExtraData(userData)
          .then(completed => {
              f.reset();
              this.uiService.hideLoadingBar();
              this.router.navigate(['/']);
          });
  }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }
}
