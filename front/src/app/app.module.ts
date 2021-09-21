import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AuthGuard } from "./core/auth.guard";
import { ErrorInterceptor } from "./core/error.interceptor";
import { JwtInterceptor } from "./core/jwt.interceptor";

import { AuthenticationService } from "./services/authentication.service";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { appRoutes } from "./routes";
import { JoblistComponent } from "./joblist/joblist.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { FindBholomenComponent } from "./find-bholomen/find-bholomen.component";
import { JobPostPriceComponent } from "./job-post-price/job-post-price.component";
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { JobPostComponent } from './job-post/job-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    JoblistComponent,
    LoginComponent,
    SignupComponent,
    FindBholomenComponent,
    JobPostPriceComponent,
    PagenotfoundComponent,
    JobPostComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
  ],
  providers: [
    AuthGuard,
    // AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
