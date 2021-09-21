import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AlertService } from "./alert/alert.service";

import * as moment from "moment";
@Injectable({
  providedIn: "root",
})
export class CoreService {
  public httpTimeout = 30000;
  public locale = "en-GH"; // Great Britain locale
  public currency = "XAF";
  public style = "decimal"; // or 'currency', then currency must be given:

  public httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  };

  public momentOffset: string = "+0100";
  moment: any = moment;

  constructor(private http: HttpClient, private alertService: AlertService) {}

  // test if a string value is null, undefined or empty
  isEmptyOrNull(value: string) {
    if (
      value == "" ||
      value == null ||
      value == undefined ||
      value == "undefined"
    ) {
      return true;
    }
    return false;
  }

  getGenderDesc(id) {
    if (id) {
      if (id.toLowerCase() == "m") {
        return "Male";
      } else {
        return "Female";
      }
    } else {
      return "";
    }
  }

  formatDate(date) {
    if (date) {
      if (this.moment(date).isValid()) {
        return this.moment(
          this.moment(date).utcOffset(this.momentOffset)._d
        ).fromNow();
      } else {
        console.error(`"${date}" is not a valid date`);
        return "";
      }
    } else {
      return "";
    }
  }

  addThouSep(num: any, maxFractionDigits = 2) {
    let formattedNum = "";
    let numb = Number(num);
    if (numb != NaN) {
      try {
        formattedNum = numb.toLocaleString(this.locale, {
          maximumFractionDigits: maxFractionDigits,
          currency: this.currency,
          style: this.style,
        });
      } catch (e) {
        console.warn(`Oops, Something went wrong! Using safe values... ${e}`);
        formattedNum = numb.toLocaleString(this.locale);
      }
      return formattedNum;
    } else {
      return "";
    }
  }

  success(msg) {
    this.alertService.success(msg, true);
  }

  error(msg) {
    this.alertService.error(msg, true);
  }

  closeAlert() {
    this.alertService.close();
  }

  makeRemoteRequest(url, method, params, options) {
    if (method.toLowerCase() == "get") {
      return new Promise((resolve, reject) => {
        this.http
          .get<any>(url)
          // .timeout(this.httpTimeout)
          .subscribe(
            (data: any) => {
              if (data.error == false) {
                resolve(data.result);
              } else {
                reject(data.error);
              }
            },
            (error: any) => {
              reject(error);
            }
          );
      });
    } else if (method.toLowerCase() == "post") {
      return new Promise((resolve, reject) => {
        this.http
          .post<any>(url, params)
          // .timeout(this.httpTimeout)
          .subscribe(
            (data: any) => {
              if (data.error == false) {
                resolve(data.result);
              } else {
                reject(data.error);
              }
            },
            (error: any) => {
              console.log("Returned Error data: ", error);
              reject(error);
            }
          );
      });
    } else if (method.toLowerCase() == "put") {
      return new Promise((resolve, reject) => {
        this.http
          .put<any>(url, params, options)
          // .timeout(this.httpTimeout)
          .subscribe(
            (data: any) => {
              if (data.error == false) {
                resolve(data.result);
              } else {
                reject(data.error);
              }
            },
            (error: any) => {
              reject(error);
            }
          );
      });
    } else if (method.toLowerCase() == "delete") {
      return new Promise((resolve, reject) => {
        this.http
          .delete<any>(url, options)
          // .timeout(this.httpTimeout)
          .subscribe(
            (data: any) => {
              if (data.error == false) {
                resolve(data.result);
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

  fakePromise(type, message) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (type == "error") {
          reject({ msg: message });
        } else {
          // type == "success"
          resolve(message);
        }
      }, 500);
    });
    return promise;
  }
}
