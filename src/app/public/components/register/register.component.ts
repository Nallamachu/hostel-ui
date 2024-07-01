import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CustomValidators } from '../../custom-validator';
import { AuthService } from '../../services/auth-service/auth.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterRequest } from '../../interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public registerForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {
    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        firstname: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required]),
        passwordConfirm: new FormControl(null, [Validators.required]),
        mobile: new FormControl(null, [Validators.required]),
        referredByCode: new FormControl(null, []),
        street: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        country: new FormControl(null, [Validators.required]),
        zipcode: new FormControl(0, [Validators.required])
      },
      {
        validators: [CustomValidators.passwordsMatching,
        CustomValidators.validZipcode]
      }
    )
  }

  register() {
    if (!this.registerForm.valid) {
      return;
    }
    var _user = this.getUserToRegister(this.registerForm.value);
    this.authService.register(_user).pipe(
      tap(() => this.router.navigate(['../login'])),
      tap(() => this.snackbar.open('User Registered Successfull', 'Close', {
        duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
      }))
    ).subscribe();
  }

  getUserToRegister(value: any) {
    const _user: RegisterRequest = {
      email: value.email,
      username: value.email,
      firstname: value.firstname,
      lastname: value.lastname,
      password: value.password,
      mobile: value.mobile,
      referralCode: value.referralCode,
      referredByCode: value.referredByCode,
      address: {
        street: value.street,
        city: value.city,
        state: value.state,
        country: value.country,
        zipcode: value.zipcode
      },
      role: 'USER'
    }
    return _user;
  }

}
