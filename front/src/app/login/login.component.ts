import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CoreService } from "../core/core.service";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"],
})
export class LoginComponent implements OnInit {
  public loginFormGroup: FormGroup;

  constructor(
    private core: CoreService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginFormGroup = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  login() {
    this.authService
      .login(
        this.loginFormGroup.value.email,
        this.loginFormGroup.value.password
      )
      .then((user: any) => {
        console.log("logged in: ", user);
        localStorage.setItem("currentUser", JSON.stringify(user.value[0]));
        this.core.success("Login successful. Redirecting...");
        this.router.navigate(["home"]);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }
}
