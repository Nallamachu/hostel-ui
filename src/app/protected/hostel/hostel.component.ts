import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALSTORAGE_TOKEN_KEY, LOCALSTORAGE_CURRENT_USER } from 'src/app/constants';
import { environment } from 'src/environments/environment'
import { ProtectedService } from '../protected.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

interface User {
  firstname: string,
  middlename: string,
  lastname: string,
  email: string,
  username: string,
  mobile: string,
  referralCode: string,
  referredByCode: string,
  points: Number
}

export interface Hostel {
  "id": number,
  "name": string,
  "type": string,
  "contact": string,
  "isActive": boolean,
  "rooms": [],
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "country": string,
    "zipcode": Number
  },
  "owner": User
}

interface Error {
  code: string,
  message: string
}

interface Response {
  data: Hostel [],
  error: Error []
}

@Component({
  selector: 'app-hostel',
  templateUrl: './hostel.component.html',
  styleUrls: ['./hostel.component.scss']
})
export class HostelComponent implements AfterViewInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  //@ViewChild(MatSort)  sorter: MatSort = new MatSort;

  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined) {
      this.router.navigate(['login']);
    } else {
      this.getHostels()
    }
  }

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sorter;
  }

  protectedService = inject(ProtectedService);
  dataSource = new MatTableDataSource<Hostel>();

  displayedColumns: string[] = ["id", "name", "type", "rooms", "owner", "contact", "isActive", "address"];
  allHostels: Hostel[] = [];
  response: Response = {
    data: [],
    error: []
  };
  getHostels() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/hostel/find-all-hostels-by-user';
    const hostels = this.protectedService.getHostels(url, userId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          console.log(this.response.data[0])
          this.dataSource = new MatTableDataSource<Hostel>(this.response.data);
          this.dataSource.paginator = this.paginator;
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
}
