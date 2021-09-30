import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {CoreService} from '../services/core.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    focus;
    focus1;

    public loadingData = false;
    public loginFormGroup: FormGroup;

    constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService,
                public core: CoreService) {
        console.log('Navigation data: ', router.getCurrentNavigation().extras.state);
    }

    ngOnInit() {
        this.initLoginForm();
    }

    initLoginForm() {
        this.loginFormGroup = this.formBuilder.group({
            rememberSignIn: [''],
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.minLength(8), Validators.required]],
        });
    }

    get formValues() {
        return this.loginFormGroup.value;
    }

    submitForm() {
        console.log('Form data: ', this.loginFormGroup.value);
        this.loadingData = true;
        this.authService.login(this.formValues.email, this.formValues.password).then(async response => {
            this.loadingData = false;
            localStorage.setItem('currentUser', JSON.stringify(response[0]));
            this.core.showSuccess('Login success', 'Redirecting...');
            location.href = '/landing';
            console.log('Response: ', response);
        }).catch(error => {
            this.loadingData = false;
            console.error('Error login: ', error);
            this.core.handleError(error, 'submitForm/login');
        });
    }

}
