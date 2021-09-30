import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app.routing';
import {ngxLoadingAnimationTypes, NgxLoadingModule} from 'ngx-loading';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {AppComponent} from './app.component';
import {SignupComponent} from './signup/signup.component';
import {ProfileComponent} from './front-office/profile/profile.component';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {FooterComponent} from './shared/footer/footer.component';
import {LoginComponent} from './login/login.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor} from './providers/error.interceptor';
import {JwtInterceptor} from './providers/jwt.interceptor';
import {HomeOldModule} from './home-old/home-old.module';
import {HomeComponent} from './home/home.component';


@NgModule({
    declarations: [
        AppComponent,
        SignupComponent,
        ProfileComponent,
        NavbarComponent,
        FooterComponent,
        LoginComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule, // required animations module
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        AppRoutingModule,
        NgxLoadingModule.forRoot({animationType: ngxLoadingAnimationTypes.chasingDots}),
        ToastrModule.forRoot({
            closeButton: true, timeOut: 10000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true, progressBar: true,
        }),
        HomeOldModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
