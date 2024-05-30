
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, ReplaySubject, Subject, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../interfaces';
import { LOCALSTORAGE_CURRENT_USER, LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';
import { environment } from 'src/environments/environment';

export const fakeLoginResponse: LoginResponse = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  refreshToken: {
    id: 1,
    userId: 2,
    token: 'fakeRefreshToken...should al come from real backend',
    refreshCount: 2,
    expiryDate: new Date(),
  },
  tokenType: 'JWT'
}

export const fakeRegisterResponse: RegisterResponse = {
  status: 200,
  message: 'Registration sucessfull.'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private jwtService: JwtHelperService
  ) { }

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // return of(fakeLoginResponse).pipe(
    //   tap((res: LoginResponse) => localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken)),
    //   tap(() => this.loggedIn.next(true)),
    //   tap(() => this.snackbar.open('Login Successfull', 'Close', {
    //     duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'
    //   }))
    // );

    return this.http.post<LoginResponse>(environment.API_URL + '/api/v1/auth/authenticate', loginRequest).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken),
          localStorage.setItem(LOCALSTORAGE_CURRENT_USER, String(res.refreshToken.id))
        this.loggedIn.next(true)
      }),
      tap(() => this.snackbar.open('Login Successfull', 'Close', {
        duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
      }))
    );
  }

  get isLoggedIn() {
    return this.loggedIn;
  }

  logout(): Observable<LoginResponse> {
    return of(fakeLoginResponse).pipe(
      tap((res: LoginResponse) => localStorage.clear()),
      tap(() => this.loggedIn.next(false)),
      tap(() => this.snackbar.open('Logout Successfull', 'Close', {
        duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
      }))
    );
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    // TODO
    // return of(fakeRegisterResponse).pipe(
    //   tap((res: RegisterResponse) => this.snackbar.open(`User created successfully`, 'Close', {
    //     duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'
    //   })),
    // );
    return this.http.post<RegisterResponse>(environment.API_URL + '/api/v1/auth/register', registerRequest).pipe(
      tap((res: RegisterResponse) => this.snackbar.open(`User created successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
      }))
    )
  }

  /*
   Get the user fromt the token payload
   */
  getLoggedInUser() {
    const decodedToken = this.jwtService.decodeToken();
    return decodedToken.user;
  }

  loginStatusChange(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  isAuthenticated(){
    return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)!=undefined?true:false;
  }
}
