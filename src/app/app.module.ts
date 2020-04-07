import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {UserAuthService} from './services/user-auth.service';
import {NgxImageCompressService} from 'ngx-image-compress';
import {HttpClientModule} from '@angular/common/http';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {CoreModule} from './core/core.module';
import {ImageCropperModule} from 'ngx-image-cropper';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        HttpClientModule,
        FlexLayoutModule,
        Ng2TelInputModule,
        ImageCropperModule,
        CoreModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        UserAuthService,
        NgxImageCompressService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
