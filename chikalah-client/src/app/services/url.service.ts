import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UrlService {
    public get baseUrl() {
        return 'http://127.0.0.1:3000/api/v1/';
    }

    constructor() {
    }
}
