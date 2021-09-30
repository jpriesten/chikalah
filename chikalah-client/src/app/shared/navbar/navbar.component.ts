import {Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Location, PopStateEvent} from '@angular/common';
import {CoreService} from '../../services/core.service';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public loadingData = false;
    public isCollapsed = true;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    public currentUser = null;

    constructor(public location: Location, private router: Router, private authService: AuthService,
                public core: CoreService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            this.isCollapsed = true;
            if (event instanceof NavigationStart) {
                if (event.url !== this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                if (event.url === this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });
        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
    }

    isHome() {
        const title = this.location.prepareExternalUrl(this.location.path());

        return title === '/home';
    }

    isDocumentation() {
        const title = this.location.prepareExternalUrl(this.location.path());
        return title === '/documentation';
    }

    logout() {
        this.loadingData = true;
        this.authService.logout().then(r => {
            console.log('Login out success', r);
            localStorage.removeItem('currentUser');
            location.href = '/login';
            this.core.showSuccess(r[0]);
            this.loadingData = false;
        }).catch(error => {
            this.loadingData = false;
            console.error('Error login out', error);
            this.core.handleError(error, 'logout');
        });
    }
}
