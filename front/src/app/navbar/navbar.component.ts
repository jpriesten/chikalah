import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.less"],
})
export class NavbarComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  logout() {
    this.authService
      .logout()
      .then((result) => {
        console.log("Result: ", result);
        localStorage.removeItem("currentUser");
        this.router.navigate(["/login"]);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }
}
