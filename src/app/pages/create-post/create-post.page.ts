import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/storage';
import {concatMap, last} from 'rxjs/operators';
import {NgxImageCompressService} from 'ngx-image-compress';
import {UiService} from '../../services/ui.service';
import {PostModel} from '../../interfaces/post-model';
import {UserPostService} from '../../services/user-post.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {UserAuthService} from '../../services/user-auth.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
    // User Auth Info..
    user$: Observable<any>;
    userId: any;

    // Reactive From...
    reactiveForm: FormGroup;
    text = new FormControl('');

    // Image Compress...
    file: any;
    localUrl: any;
    localCompressedURl: string[] = [];
    // Result...
    imgFilesUrl: string[] = [];

    constructor(
        private afAuth: AngularFireAuth,
        private storage: AngularFireStorage,
        private userAuthService: UserAuthService,
        private uiService: UiService,
        private postService: UserPostService,
        private imageCompress: NgxImageCompressService
    ) { }


    ngOnInit() {
        // Get Author...
        this.afAuth.authState.subscribe((auth) => {
            if (auth) {
                this.userId = auth;
                this.user$ = this.userAuthService.getUserCompleteFieldData(this.userId).valueChanges();
            }
        });
        // Form...
        this.reactiveForm = new FormGroup({
            text: this.text,
        });
    }

    // Prevent Page Reload..
    // @HostListener('window:beforeunload', ['$event'])
    // unloadNotification($event: any) {
    //   $event.returnValue = true;
    // }


    selectFile(event: any) {
        this.file = event.target.files[0];
        let fileName;
        if (this.file === null || this.file === undefined) {
            // this.uiService.hideLoadingBar();
            this.uiService.showToastMessage('No Image selected.');
            return;
        } else {
            this.uiService.showLoadingBar('Uploading...');
            fileName = `${Date.now().toString()}_${this.file.name}`;
        }
        const fileHdNewName = `hd_${fileName}`;
        const fileThumbNewName = `thumb_${fileName}`;
        const dbHdFilePath = `Post_Images/${fileHdNewName}`;
        const dbThumbFilePath = `Post_Images/${fileThumbNewName}`;


        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            // tslint:disable-next-line:no-shadowed-variable
            reader.onload = (event: any) => {
                this.localUrl = event.target.result;
                const compressType = [
                    {
                        localUrl: this.localUrl,
                        fileName: fileThumbNewName,
                        ratio: 25,
                        quality: 40,
                        dbPath: dbThumbFilePath
                    },
                    {
                        localUrl: this.localUrl,
                        fileName: fileHdNewName,
                        ratio: 50,
                        quality: 50,
                        dbPath: dbHdFilePath
                    }
                ];
                for (const file of compressType) {
                    this.compressFile(file.localUrl, file.fileName, file.ratio, file.quality, file.dbPath);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }


    compressFile(localUrl, fileName, ratio, quality, dbPath) {
        const orientation = -1;
        this.imageCompress.compressFile(localUrl, orientation, ratio, quality).then(
            result => {
                this.localCompressedURl.push(result);
                // create file from byte
                const imageBlob = this.dataURItoBlob(result.split(',')[1]);

                const readyFile = this.storage.upload(dbPath, imageBlob);

                readyFile.snapshotChanges()
                    .pipe(
                        last(),
                        concatMap(() => this.storage.ref(dbPath).getDownloadURL())
                    ).subscribe(res => {
                    this.imgFilesUrl.push(res);
                    if (this.imgFilesUrl.length === 2) {
                        this.uiService.hideLoadingBar();
                    }
                });
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

    deleteImg() {
        const imgUrls = this.imgFilesUrl;

        for (const url of imgUrls) {
            this.storage.storage.refFromURL(url).delete();
        }

        // Result...
        // this.file.name = '';
        this.file = '';
        this.localUrl = '';
        this.localCompressedURl = [];
        this.imgFilesUrl = [];
    }

    onSubmit() {
        this.uiService.showLoadingBar('Publishing Your Post..');
        const textValue = this.reactiveForm.value.text.trim();

        if (textValue === '' && this.imgFilesUrl.length !== 2) {
            this.uiService.showToastMessage('Sorry! Post Can Not be Empty.');
            this.uiService.hideLoadingBar();
            return;
        }
        // if (this.reactiveForm.value.text.trim().length === 0) {
        //     this.uiService.showToastMessage('Sorry! Post Can Not be Empty.');
        //     return;
        // }
        const localUserData = JSON.parse(localStorage.getItem('user'));
        const post: PostModel = {
            authorID: localUserData.uid,
            postID: '',
            date: Date.now(),
            permission: true,
            postDescription: textValue,
            postThumbnail: this.imgFilesUrl.length !== 2 ? '' : this.imgFilesUrl[0],
            postImage: this.imgFilesUrl.length !== 2 ? '' : this.imgFilesUrl[1],
            privacy: 'public',
            type: 'post'
        };


        this.postService.createNewPost(post);
        this.imgFilesUrl = [];
    }

}
