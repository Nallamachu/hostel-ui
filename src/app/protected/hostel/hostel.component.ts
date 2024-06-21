import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALSTORAGE_TOKEN_KEY, LOCALSTORAGE_CURRENT_USER, LOCALSTORAGE_HOSTEL_ID } from 'src/app/constants';
import { environment } from 'src/environments/environment'
import { ProtectedService } from '../protected.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Hostel, Response } from 'src/app/public/interfaces';

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
    this.protectedService.hostelToModify = undefined;
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

  displayedColumns: string[] = ["id", "name", "type", "owner", "contact", "isActive", "address", "actions"];
  allHostels: Hostel[] = [];
  response: Response = {
    data: [],
    errors: []
  };
  getHostels() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/hostel/find-all-hostels-by-user-no-pagination';
    const hostels = this.protectedService.getAllHostelsByUser(url, userId).subscribe(
      (data) => {
        this.response = data;
        if (this.response.errors) {
          tap(() => this.snackbar.open(this.response.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createHostel() {
    this.router.navigate(['create-update-hostel']);
  }

  modifyHostel(hostel: Hostel) {
    this.protectedService.hostelToModify = hostel;
    this.router.navigate(['create-update-hostel']);
  }

  deleteHostel(hostel: Hostel) {
    this.protectedService.getAllRoomsByHostelId(environment.API_URL + '/api/v1/room/rooms-by-hostel-id', hostel.id).subscribe(
      (data) => {
        this.response = data;
        if (this.response.errors) {
          tap(() => this.snackbar.open(this.response.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
          return of(false);
        } else if (this.response.data != null && this.response.data.length > 0) {
          console.log(this.response.data.length);
          if (this.response.data.length > 0) {
            this.snackbar.open('Hostel is not empty. Cannot be deleted.', 'Close', {
              duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'
            });
            return of(false);
          }
        } else {
          let url = environment.API_URL + '/api/v1/hostel/delete-hostel/';
          const name = 'Delete ' + hostel.name + ' ' + '?';
          if (window.confirm('Are you sure you want to delete the hostel ' + hostel.name + '?')) {
            return this.protectedService.deleteRecord(url + hostel.id).subscribe(
              (data) => {
                this.response = data;
                if (this.response.errors) {
                  tap(() => this.snackbar.open(this.response.errors[0].message, 'Close', {
                    duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
                  }))
                } else {
                  this.deleteRowDataTable(hostel.id, this.paginator, this.dataSource);
                }
              },
              (error) => {
                console.log('Error while trying to fetch all hostels');
                tap(() => this.snackbar.open(error, 'Close', {
                  duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
                }))
              }
            );
          }
        }
      }
    );
  }

  private deleteRowDataTable(recordId: number, paginator: any, dataSource: any) {
    const itemIndex = dataSource.data.findIndex((obj: any) => obj['id'] === recordId);
    dataSource.data.splice(itemIndex, 1);
    dataSource.paginator = paginator;
  }

  gotoRooms(_hostelId: any) {
    localStorage.setItem(LOCALSTORAGE_HOSTEL_ID, _hostelId);
    this.router.navigate(['room']);
  }

  gotoExpenses(_hostelId: any) {
    localStorage.setItem(LOCALSTORAGE_HOSTEL_ID, _hostelId);
    this.router.navigate(['expense']);
  }
}
