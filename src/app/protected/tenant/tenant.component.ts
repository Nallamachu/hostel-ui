import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER, LOCALSTORAGE_ROOM_ID, LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';
import { Tenant, Response } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../protected.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss']
})
export class TenantComponent {
  protectedService = inject(ProtectedService);
  dataSource = new MatTableDataSource<Tenant>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  selectedRoomId = localStorage.getItem(LOCALSTORAGE_ROOM_ID);

  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      (this.selectedRoomId == undefined)
        ? this.getAllTenantsByUserId()
        : this.getAllTenantsByRoomId(this.selectedRoomId);
      ;
    }
  }

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
  ) {}

  response: Response = {
    data: [],
    error: []
  };

  tenants: Tenant[] = []

  displayedColumns = ["id", "name", "room", "mobile", "idType", "idNumber", "address", "entryDate", "exitDate", "isActive", "actions"];

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
          this.dataSource = new MatTableDataSource<Tenant>(this.response.data);
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
    return tenants;
  }

  getAllTenantsByRoomId(roomId: any) {
    let url = environment.API_URL + '/api/v1/tenant/tenants-by-room-id';
    const tenants = this.protectedService.getAllTenantsByRoomId(url, roomId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.dataSource = new MatTableDataSource<Tenant>(this.response.data);
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.log('Error while trying to fetch getAllTenantsByRoomId');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return tenants;
  }

  gotoTenantDetails(tenantId:any) {
    console.log(tenantId);
  }

  addTenant(){

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
