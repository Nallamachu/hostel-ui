import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from './public/components/header/header.component';
import { LoginComponent } from './public/components/login/login.component';
import { RegisterComponent } from './public/components/register/register.component';

import { JwtModule } from '@auth0/angular-jwt';
import { FooterComponent } from './public/components/footer/footer.component';
import { LOCALSTORAGE_TOKEN_KEY } from './constants';
import { AddressComponent } from './public/components/address/address.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkColumnDef } from '@angular/cdk/table';


// specify tokenGetter for the angular jwt package
export function tokenGetter() {
  return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
}

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, LoginComponent, RegisterComponent, FooterComponent, AddressComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000', 'localhost:8080']
      }
    })
  ],
  providers: [CdkColumnDef],
  bootstrap: [AppComponent]
})
export class AppModule { }
