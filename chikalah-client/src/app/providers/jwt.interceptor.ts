/**
 * The JWT Interceptor intercepts http requests from the application to add a JWT auth token to the
 * Authorization header if the user is logged in.
 */

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoreService} from '../services/core.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private core: CoreService) {
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // add authorisation header with jwt token if available
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
        }

        return next.handle(request);
    }
}
