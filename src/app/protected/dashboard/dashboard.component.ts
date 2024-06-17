import { Hostel, Tenant, Expense, Response, Room } from 'src/app/public/interfaces';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALSTORAGE_TOKEN_KEY, LOCALSTORAGE_CURRENT_USER, LOCALSTORAGE_HOSTEL_ID, LOCALSTORAGE_ROOM_ID } from 'src/app/constants';
import { environment } from 'src/environments/environment'
import { ProtectedService } from '../protected.service';
import { tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  protectedService = inject(ProtectedService);

  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      localStorage.removeItem(LOCALSTORAGE_HOSTEL_ID);
      localStorage.removeItem(LOCALSTORAGE_ROOM_ID);
      this.getAllHostels();
      this.getAllRoomsByUserId();
      this.getAllTenantsByUserId();
      this.getAllExpensesByUserId();
    }
  }

  constructor(
    private router: Router,
    public authService: AuthService,
    private snackbar: MatSnackBar
  ) {}

  hostels : Hostel[]= [];

  rooms: Room[] = [];

  tenants: Tenant[] = []
  
  expenses: Expense[] = [];

  response: Response = {
    data: [],
    error: []
  }

  getAllHostels() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/hostel/find-all-hostels-by-user-no-pagination';
    const hostels = this.protectedService.getAllHostelsByUser(url, userId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.hostels = this.response.data;
          console.log(this.hostels);
        }
      },
      (error) => {
        console.log('Error while trying to fetch all hostels');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return hostels;
  }

  getAllRoomsByUserId() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/room/rooms-by-user-id';
    const rooms = this.protectedService.getAllRoomsByUserId(url, userId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.rooms = this.response.data;
          console.log(this.rooms);
        }
      },
      (error) => {
        console.log('Error while trying to fetch all hostels');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return rooms;
  }

  getAllTenantsByUserId() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/tenant/tenants-by-user-id';
    const tenants = this.protectedService.getAllTenantsByUserId(url, userId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.tenants = this.response.data;
          console.log(this.tenants);
        }
      },
      (error) => {
        console.log('Error while trying to fetch all hostels');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return tenants;
  }

  getAllExpensesByUserId() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/expense/find-all-expenses-by-user-id';
    const expenses = this.protectedService.getAllExpensesByUserId(url, userId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.expenses = this.response.data;
          console.log(this.expenses);
        }
      },
      (error) => {
        console.log('Error while trying to fetch all hostels');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return expenses;
  }

}
