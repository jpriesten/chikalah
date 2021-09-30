/**
 * The Error Interceptor intercepts http responses from the api to check if there were any errors. If there is a 401 Unauthorized response
 * the user is automatically logged out of the application, all other errors are re-thrown to be caught by the calling service so an alert
 * can be displayed to the user.
 */

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log('Error intercepted: ', err);
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                localStorage.removeItem('currentUser');
                location.href = '';
            }
            return throwError(err.error);
        }));
    }
}
