import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { APP_NAME } from 'src/app/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  authenticated!: boolean;
  appName: string = APP_NAME;
  constructor(private router: Router, public authService: AuthService) {
    
  }

  ngOnInit() {
    this.authService.loginStatusChange().subscribe(loggedIn => {
      this.authenticated = loggedIn
    });
  }

  isAuthenticated() {
    this.authService.loginStatusChange().subscribe(loggedIn => {
      this.authenticated = loggedIn
    });
    return this.authenticated;
  }

  logout() {
   localStorage.clear();
    this.authService.logout().pipe(
      tap(() => this.router.navigate(['login']))
    ).subscribe();
  }

}
