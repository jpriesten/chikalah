import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { CoreService } from "../core/core.service";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.less"],
})
export class SignupComponent implements OnInit {
  public registerFormGroup: FormGroup;

  constructor(
    private core: CoreService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registerFormGroup = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  register() {
    this.authService
      .register(
        this.registerFormGroup.value.name,
        this.registerFormGroup.value.email,
        this.registerFormGroup.value.password
      )
      .then((user: any) => {
        console.log("New: ", user);
        localStorage.setItem("currentUser", JSON.stringify(user.value[0]));
        this.core.success("Registration successful. Redirecting...");
        this.router.navigate(["home"]);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }
}
