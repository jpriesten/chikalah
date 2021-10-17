import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/landing'
            },
            {path: 'landing', canActivate: [AuthGuard], component: LandingComponent},
            {path: 'user-profile', canActivate: [AuthGuard], component: ProfileComponent},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FrontOfficeRoutingModule {
}
