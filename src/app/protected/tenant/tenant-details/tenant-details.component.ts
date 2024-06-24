import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';
import { Tenant, Response, Payment } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../../protected.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrls: ['./tenant-details.component.scss']
})
export class TenantDetailsComponent {

  dataSource = new MatTableDataSource<Tenant>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  selectedTenant!: Tenant;

  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      this.getAllPaymentsByTenantId(this.selectedTenant.id);
    }
  }

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private protectedService: ProtectedService
  ) {
    console.log(protectedService.tenantToModify)
    if(protectedService.tenantToModify != null){
      this.selectedTenant = protectedService.tenantToModify;
    }
  }

  response: Response = {
    data: [],
    errors: []
  };

  payments!: Payment[];

  displayedColumns = ["id", "tenant", "paymentType", "transactionType", "paymentDate", "amount", "actions"];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getImagePath() {
    return "assets/msr-tech-soft.jpg";
  }
  addPayment() {
    this.protectedService.tenantToModify = this.selectedTenant;
    this.router.navigate(['create-update-payment']);
  }

  getAllPaymentsByTenantId(tenantId: number) {
    let url = environment.API_URL + '/api/v1/payment/payments-by-tenant-id';
    const response = this.protectedService.getAllPaymentsByTenantId(url, tenantId).subscribe(
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
        console.log('Error while trying to fetch payments by tenantId');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return response;
  }

  modifyPayment(payment: Payment){
    this.protectedService.tenantToModify = this.selectedTenant;
    this.protectedService.paymentToModify = payment;
    this.router.navigate(['create-update-payment']);
  }

  
  deletePayment(payment: Payment) {
    if(window.confirm('Are you sure you want to delete the Payment with Id of ' + payment.id + '?')){
      this.protectedService.deleteRecord(environment.API_URL+'/api/v1/payment/delete-payment/'+payment.id).subscribe(
        (data) => {
          if(data.errors!= null && data.errors.length > 0) {
            this.snackbar.open(data.errors[0].message, 'Close', {
              duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
            });
            return of(false);
          } else {
            this.deleteRowDataTable (payment.id,  this.paginator, this.dataSource);
            this.snackbar.open(data.data, 'Close', {
              duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
            });
          }
        },
        (error) => {
          console.error('Error while trying to delete Payment with id '+payment.id);
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

  
  backToTenants() {
    this.protectedService.tenantToModify = undefined;
    this.router.navigate(['tenant']);
  }

}
