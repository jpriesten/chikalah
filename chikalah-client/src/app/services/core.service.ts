import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {timeout} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
    }),
};

@Injectable({
    providedIn: 'root'
})
export class CoreService {
    public httpTimeout = 30 * 1000;

    constructor(private http: HttpClient, private toaster: ToastrService
    ) {
    }

    showInfo(msg, header?) {
        this.toaster.info(msg, header, {
            timeOut: 15000,
        });
    }

    showSuccess(msg, header?) {
        this.toaster.success(msg, header, {
            timeOut: 5000,
        });
    }

    showError(msg, header?) {
        this.toaster.error(msg, header, {
            timeOut: 10000,
        });
    }

    handleError(e, origin, notifyUser: boolean = true) {

        console.error('origin: ', origin);
        console.error(e);

        if (e.msg || (e.error && e.error.msg)) {
            // message returned from web api is displayed to the user
            if (notifyUser) {
                this.showError(e.msg || e.message);
            }
        } else if (e.toString().indexOf('Timeout has occurred') !== -1) {
            this.showError(
                'Network too slow. Please check your connection and try again later.', 'Network error'
            );
        } else {
            // we get here because the http request failed, i.e, we couldn't reach the web api
            // for now 'Unknown Error' is returned when connection fails.
            // we'll do a better job retrieving the error later (sth like net::ERR_INTERNET_DISCONNECTED)


            // i'd rather display the messagpackageLimitsServicee right here than redirect to a lost connection page...
            this.showError(
                'Could not reach server. Please check your connection and try again later.', 'Unknown error'
            );

        }
    }


    makeRemoteRequest(url, method, params, options = httpOptions, timeoutSecs ?) {
        if (method.toLowerCase() === 'get') {
            return new Promise((resolve, reject) => {
                this.http
                    .get<any>(url)
                    .pipe(timeout(timeoutSecs || this.httpTimeout))
                    .subscribe(
                        (data: any) => {
                            if (data.error === false) {
                                resolve(data.result.value);
                            } else {
                                reject(data.error);
                            }
                        },
                        (error: any) => {
                            reject(error);
                        }
                    );
            });
        } else if (method.toLowerCase() === 'post') {
            return new Promise((resolve, reject) => {
                this.http
                    .post<any>(url, params)
                    .pipe(timeout(timeoutSecs || this.httpTimeout))
                    .subscribe(
                        (data: any) => {
                            if (data.error === false) {
                                resolve(data.result.value);
                            } else {
                                reject(data.error);
                            }
                        },
                        (error: any) => {
                            reject(error);
                        }
                    );
            });
        } else if (method.toLowerCase() === 'put') {
            return new Promise((resolve, reject) => {
                this.http
                    .put<any>(url, params, options)
                    .pipe(timeout(timeoutSecs || this.httpTimeout))
                    .subscribe(
                        (data: any) => {
                            if (data.error === false) {
                                resolve(data.result.value);
                            } else {
                                reject(data.error);
                            }
                        },
                        (error: any) => {
                            reject(error);
                        }
                    );
            });
        } else if (method.toLowerCase() === '' +
            'delete') {
            return new Promise((resolve, reject) => {
                this.http
                    .delete<any>(url, options)
                    .pipe(timeout(timeoutSecs || this.httpTimeout))
                    .subscribe(
                        (data: any) => {
                            if (data.error === false) {
                                resolve(data.result.value);
                            } else {
                                reject(data.error);
                            }
                        },
                        (error: any) => {
                            reject(error);
                        }
                    );
            });
        } else {
            console.log(`method ${method} is not implemented`);
        }
    }

// test if a string value is null, undefined or empty
    isEmptyOrNull(value
                      :
                      string
    ) {
        return value === '' ||
            value === null ||
            value === undefined ||
            value === 'undefined';
    }
}
