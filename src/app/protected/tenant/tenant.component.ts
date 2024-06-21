import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
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
    this.protectedService.tenantToModify = undefined;
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      (this.selectedRoomId == undefined)
        ? this.getAllTenantsByUserId()
        : this.getAllTenantsByRoomId(Number(this.selectedRoomId));
    }
  }

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
  ) {}

  response: Response = {
    data: [],
    errors: []
  };

  tenants: Tenant[] = []

  displayedColumns = ["id", "name", "room", "mobile", "idType", "idNumber", "address", "entryDate", "exitDate", "isActive", "actions"];

  getAllTenantsByUserId() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/tenant/tenants-by-user-id';
    const tenants = this.protectedService.getAllTenantsByUserId(url, userId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.errors) {
          tap(() => this.snackbar.open(this.response.errors[0].message, 'Close', {
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

  getAllTenantsByRoomId(roomId: number) {
    let url = environment.API_URL + '/api/v1/tenant/tenants-by-room-id';
    const tenants = this.protectedService.getAllTenantsByRoomId(url, roomId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.errors) {
          tap(() => this.snackbar.open(this.response.errors[0].message, 'Close', {
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
    this.router.navigate(['create-update-tenant']);
  }

  deleteTenant(tenant: Tenant) {
    if(window.confirm('Are you sure you want to delete the Tenant of ' + tenant.firstName + ' '+ tenant.middleName + ' '+ tenant.lastName + '?')){
      this.protectedService.deleteRecord(environment.API_URL+'/api/v1/tenant/delete-tenant-by-id/'+tenant.id).subscribe(
        (data) => {
          if(data.errors!= null && data.errors.length > 0) {
            this.snackbar.open(data.errors[0].message, 'Close', {
              duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
            });
            return of(false);
          } else {
            this.deleteRowDataTable (tenant.id,  this.paginator, this.dataSource);
            this.snackbar.open(data.data, 'Close', {
              duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
            });
          }
        },
        (error) => {
          console.error('Error while trying to delete tenant');
          tap(() => this.snackbar.open(error, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        }
      );
    }
  }
  
  private deleteRowDataTable (recordId:number, paginator: any, dataSource: any) {
    const itemIndex = dataSource.data.findIndex((obj:any) => obj['id'] === recordId);
    dataSource.data.splice(itemIndex, 1);
    dataSource.paginator = paginator;
  }


  modifyTenant(tenant: Tenant) {
    this.protectedService.tenantToModify = tenant;
    this.router.navigate(['create-update-tenant']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
