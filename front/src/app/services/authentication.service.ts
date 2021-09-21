import { Injectable } from "@angular/core";
import { UrlService } from "../core/url.service";
import { CoreService } from "../core/core.service";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  public httpOptions: any = [];

  constructor(public url: UrlService, private core: CoreService) {
    this.httpOptions = this.core.httpOptions;
  }

  register(name: string, email: string, password: string) {
    // if(this.core.userHasPermission('xxx')){
    if (true) {
      let url = this.url.register;
      let params = new HttpParams();

      // These parameters are always passed
      params = params.set("name", name);
      params = params.set("email", email);
      params = params.set("password", password);

      return this.core.makeRemoteRequest(url, "post", params, this.httpOptions);
    } else {
      return this.core.fakePromise(
        "error",
        "Sorry, you're not allowed to do this!"
      );
    }
  }

  login(email: any, password: any) {
    // if(this.core.userHasPermission('xxx')){
    if (true) {
      let url = this.url.login;
      let params = new HttpParams();

      // These parameters are always passed
      params = params.set("email", email);
      params = params.set("password", password);

      return this.core.makeRemoteRequest(url, "post", params, this.httpOptions);
    } else {
      return this.core.fakePromise(
        "error",
        "Sorry, you're not allowed to do this!"
      );
    }
  }

  logout() {
    // if(this.core.userHasPermission('xxx')){
    if (true) {
      let url = this.url.logout;
      let params = new HttpParams();

      return this.core.makeRemoteRequest(url, "post", params, this.httpOptions);
    } else {
      return this.core.fakePromise(
        "error",
        "Sorry, you're not allowed to do this!"
      );
    }
  }

  createJobPost(data: any) {
    // if(this.core.userHasPermission('xxx')){
    if (true) {
      let url = this.url.createPost;
      let params = new HttpParams();

      params.set('postName', data.postName);
      params.set('descr', data.descr);
      params.set('jobLocation', data.jobLocation);
      params.set('priceRange', data.priceRange);
      params.set('jobType', data.jobType);
      params.set('start', data.start);
      params.set('deadline', data.deadline);
      params.set('userSkill', data.userSkill);
      params.set('experience', data.experience);
      params.set('companyName', data.companyName);

      this.core.makeRemoteRequest(url, 'post', params, this.httpOptions);
    }
    else {
      return this.core.fakePromise(
        "error",
        "Sorry, you're not allowed to do this!"
      );
    }
  }
}
