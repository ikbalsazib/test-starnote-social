import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/storage';
import {concatMap, last} from 'rxjs/operators';
import * as moment from 'moment';
import {NgxImageCompressService} from 'ngx-image-compress';
import {UiService} from '../../services/ui.service';
import {PostModel} from '../../interfaces/post-model';
import {UserPostService} from '../../services/user-post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {

  // Reactive From...
  reactiveForm: FormGroup;
  text = new FormControl(null);

  // Image Compress..
  imgFilesUrl: string[] = [];
  imgResultAfterCompress: string;
  file: any;
  localUrl: any;

  constructor(
      private storage: AngularFireStorage,
      private uiService: UiService,
      private postService: UserPostService,
      private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      text: this.text,
    });
  }

  // For Image Upload...
  onImageUpload(event: any) {
    const file: File = (event.target as HTMLInputElement).files[0];
    this.uiService.showLoadingBar('Uploading...');
    const fileName = `${new Date().getTime().toString()}_${file.name}`;
    const HQFilePath = `Post_Images/${fileName}`;
    const ThumbFilePath = `Post_Images/thumb_${fileName}`;

    // For Compress....
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.compressFile(this.localUrl, ThumbFilePath, HQFilePath, file);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  compressFile(imageThumb, ThumbFilePath, hQFilePath, fileHQ) {
    const orientation = -1;
    this.imageCompress.compressFile(imageThumb, orientation, 50, 50).then(
        result => {
          this.imgResultAfterCompress = result;
          // Recompile Image as a File...
          const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);

          // For Database Upload..
          const fileList = [
            {filePath: ThumbFilePath, fileImg: imageBlob},
            {filePath: hQFilePath, fileImg: fileHQ},
          ];

          for (const file of fileList) {
            const readyFile = this.storage.upload(file.filePath, file.fileImg);

            readyFile.snapshotChanges()
                .pipe(
                    last(),
                    concatMap(() => this.storage.ref(file.filePath).getDownloadURL())
                ).subscribe(res => {
              this.imgFilesUrl.push(res);
              if (this.imgFilesUrl.length === 2) {
                this.uiService.hideLoadingBar();
              }
            });
          } // End Upload Multiple File..

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


  onSubmit() {
      if (this.reactiveForm.value.text === '' && this.imgFilesUrl.length !== 2) {
        this.uiService.showToastMessage('Sorry! Post Can Not be Empty.');
        return;
      }
      if (this.imgFilesUrl.length !== 2) {
        this.imgFilesUrl[0] = '';
        this.imgFilesUrl[1] = '';
      }
      this.uiService.showLoadingBar('Publishing Your Post..');
      const localUserData = JSON.parse(localStorage.getItem('user'));
      const post: PostModel = {
        authorID: localUserData.uid,
        postID: '',
        date: Date.now(),
        permission: true,
        postDescription: this.reactiveForm.value.text,
        postThumbnail: this.imgFilesUrl[0],
        postImage: this.imgFilesUrl[1],
        privacy: 'public',
        type: 'post'
      };

      this.postService.createNewPost(post);
    }


}
