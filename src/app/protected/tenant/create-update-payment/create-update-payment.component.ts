import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { every, of, tap } from 'rxjs';
import { Payment, Tenant } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../../protected.service';
import { Response } from 'src/app/public/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-create-update-payment',
  templateUrl: './create-update-payment.component.html',
  styleUrls: ['./create-update-payment.component.scss']
})
export class CreateUpdatePaymentComponent {
  public paymentForm: FormGroup;
  paymentToModify!: Payment;
  tenantToModify!: Tenant;

  paymentTypes = [
    { id: 'DEPOSIT', value: 'DEPOSIT' },
    { id: 'RENT', value: 'RENT' }
  ];

  transactionTypes = [
    { id: 'CASH', value: 'CASH' },
    { id: 'UPI', value: 'UPI' },
    { id: 'CARD', value: 'CARD' },
    { id: 'ACCOUNT', value: 'ACCOUNT' }
  ];

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-IN');

    if (protectedService.paymentToModify != null && protectedService.tenantToModify!= undefined) {
      this.tenantToModify = protectedService.tenantToModify;
      this.paymentToModify = protectedService.paymentToModify;
    } else if(protectedService.tenantToModify!= undefined){
      this.tenantToModify = protectedService.tenantToModify;
    }
    this.paymentForm = new FormGroup(
      {
        id: new FormControl((this.paymentToModify != undefined)? this.paymentToModify.id:0),
        tenantName: new FormControl((this.tenantToModify != undefined)? this.tenantToModify.firstName + ' '+ this.tenantToModify.lastName:null, 
          [Validators.required]),
        paymentType: new FormControl((this.paymentToModify != undefined)? this.paymentToModify.paymentType:null, 
          [Validators.required]),
        paymentDate: new FormControl((this.paymentToModify != undefined)? this.paymentToModify.paymentDate:null, 
          [Validators.required]),
        transactionType: new FormControl((this.paymentToModify != undefined)? this.paymentToModify.transactionType:null, []),
        amount: new FormControl((this.paymentToModify != undefined)? this.paymentToModify.amount:null, 
          [Validators.required]),
        tenantExpiryDate: new FormControl((this.tenantToModify != undefined)? this.tenantToModify.exitDate:null, 
          [Validators.required])
      }
    );
  }

  createOrModifyPayment() {
    if (this.paymentForm.invalid)
      return;

    if (this.paymentForm.value.id > 0) {
      this.modifyPayment();
    } else {
      this.createPayment();
    }
  }

  modifyPayment() {
    let payment = this.getPaymentObject(this.paymentForm.value);
    payment.tenant.exitDate=this.paymentForm.value.tenantExpiryDate;
    this.protectedService.updateRecord(environment.API_URL + '/api/v1/payment/modify-payment/' + payment.id, payment)
    .pipe(
      tap((res: Response) => {
        if (res.errors) {
          this.snackbar.open(res.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
        } else {
          this.router.navigate(['tenant-details']);
          this.snackbar.open('Payment Modified Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
          this.protectedService.paymentToModify = undefined;
          this.protectedService.tenantToModify = payment.tenant;
        }
      })
    ).subscribe();
  }

  async createPayment() {
    let payment = this.getPaymentObject(this.paymentForm.value);
    payment.tenant.exitDate=this.paymentForm.value.tenantExpiryDate;
    this.protectedService.createRecord(environment.API_URL + '/api/v1/payment/create-payment', payment).pipe(
      tap((res: Response) => {
        if (res.errors) {
          tap(() => this.snackbar.open(res.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
        } else {
          this.router.navigate(['tenant-details']);
          tap(() => this.snackbar.open('Payment Created Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
        }
      })
    ).subscribe();
  }

  getPaymentObject(value: any) {
    const _payment: Payment = {
      id: value.id,
      paymentType: value.paymentType,
      transactionType: value.transactionType,
      paymentDate: value.paymentDate,
      amount: value.amount,
      tenant: (this.paymentToModify!=undefined)?this.paymentToModify.tenant:this.tenantToModify
    }
    return _payment;
  }

  backToTenantDetails() {
    this.protectedService.paymentToModify = undefined;
    this.router.navigate(['tenant-details']);
  }
}
