import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {CoreService} from '../services/core.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
    test: Date = new Date();
    focus;
    focus1;
    focus2;
    focus3;

    public loadingData = false;
    public registerFormGroup: FormGroup;

    constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService,
                public core: CoreService) {
    }

    ngOnInit() {
        this.initRegisterForm();
    }

    initRegisterForm() {
        this.registerFormGroup = this.formBuilder.group({
            firstname: ['', Validators.required],
            lastname: [''],
            signedContract: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.minLength(8), Validators.required]],
        });
    }

    get formValues() {
        return this.registerFormGroup.value;
    }

    submitForm() {
        console.log('Form data: ', this.registerFormGroup.value);
        this.loadingData = true;
        this.authService.register(this.formValues.firstname, this.formValues.lastname, this.formValues.email,
            this.formValues.password).then(response => {
            this.loadingData = false;
            this.core.showSuccess('Registration success', 'Registered');
            this.core.showInfo('Please check your email for a verification link.', 'Redirecting...');
            this.router.navigate(['/login'], {state: {data: this.registerFormGroup.value}});
            console.log('Response: ', response);
        }).catch(error => {
            this.loadingData = false;
            console.error('Error registering: ', error);
            this.core.handleError(error, 'submitForm/register');
        });
    }
}
