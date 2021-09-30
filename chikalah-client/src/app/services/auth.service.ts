import {Injectable} from '@angular/core';
import {CoreService} from './core.service';
import {UrlService} from './url.service';
import {HttpParams} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public baseUrl: string;

    constructor(
        private urlService: UrlService,
        public core: CoreService
    ) {
        this.baseUrl = `${this.urlService.baseUrl}`;
    }

    /** POST: Register to chikalah */
    register(
        firstname: string, otherNames: string, email: string, password: string,
    ): Promise<any> {
        const url = this.baseUrl + 'user/register';

        let params = new HttpParams();

        // These parameters are always passed
        if (!this.core.isEmptyOrNull(firstname)) {
            params = params.set('firstname', firstname);
        }
        if (!this.core.isEmptyOrNull(otherNames)) {
            params = params.set('othernames', otherNames);
        }
        if (!this.core.isEmptyOrNull(email)) {
            params = params.set('email', email);
        }
        if (!this.core.isEmptyOrNull(password)) {
            params = params.set('password', password);
        }

        return this.core.makeRemoteRequest(url, 'post', params);
    }

    /** POST: login to chikalah */
    login(
        email: string,
        password: string,
    ): Promise<any> {
        const url = this.baseUrl + 'user/login';

        let params = new HttpParams();

        // These parameters are always passed
        if (!this.core.isEmptyOrNull(email)) {
            params = params.set('email', email);
        }
        if (!this.core.isEmptyOrNull(password)) {
            params = params.set('password', password);
        }

        return this.core.makeRemoteRequest(url, 'post', params);
    }

    /** POST: logout */
    logout(): Promise<any> {
        const url = this.baseUrl + 'user/logout';
        const params = new FormData();

        return this.core.makeRemoteRequest(url, 'post', params);
    }
}
