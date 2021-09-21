import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UrlService {
  private rootUrl: string;

  constructor() {
    this.rootUrl = "http://localhost:3000/api/v1";
  }

  /* Authentication Endpoints */
  public get register() {
    return `${this.rootUrl}/users/create`;
  }
  public get login() {
    return `${this.rootUrl}/users/login`;
  }
  public get logout() {
    return `${this.rootUrl}/users/logout`;
  }
  public get createPost(){
    return `${this.rootUrl}/posts/new`;
  }
}
