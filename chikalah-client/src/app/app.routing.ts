import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {HomeOldComponent} from './home-old/home-old.component';
import {LoggedInGuard} from "./guards/logged-in.guard";

const routes: Routes = [
    {
        path: '',
        loadChildren: () => {
            return import('../app/front-office/front-office.module').then(
                (m) => m.FrontOfficeModule
            );
        },
    },
    {
        path: 'admin',
        loadChildren: () => {
            return import('../app/back-office/back-office.module').then(
                (m) => m.BackOfficeModule
            );
        },
    },
    {path: 'home', component: HomeComponent},
    {path: 'home-old', component: HomeOldComponent},
    {path: 'register', component: SignupComponent, canActivate: [LoggedInGuard]},
    {path: 'login', component: LoginComponent, canActivate: [LoggedInGuard]},
    // {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: ''},
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [],
})
export class AppRoutingModule {
}
