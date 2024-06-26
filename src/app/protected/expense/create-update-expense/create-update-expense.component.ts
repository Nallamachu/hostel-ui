import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER } from 'src/app/constants';
import { Expense, Hostel } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../../protected.service';
import { Response } from 'src/app/public/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-update-expense',
  templateUrl: './create-update-expense.component.html',
  styleUrls: ['./create-update-expense.component.scss']
})
export class CreateUpdateExpenseComponent {
  public expenseForm: FormGroup;
  hostels!: Hostel[];
  expenseToModify!: Expense | undefined | null;

  expenseTypes = [
    { id: 'RENT', value: 'RENT' },
    { id: 'SALARY', value: 'SALARY' },
    { id: 'GROCERIES', value: 'GROCERIES' },
    { id: 'VEGITABLES', value: 'VEGITABLES' },
    { id: 'REPAIRS', value: 'REPAIRS' },
    { id: 'POWER', value: 'POWER' },
    { id: 'OTHER', value: 'OTHER' }
  ];

  ngOnInit() {
    this.getHostels();
  }

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
  ) {
    if (this.protectedService.expenseToModify != undefined) {
      this.expenseToModify = this.protectedService.expenseToModify;
    }
    this.expenseForm = new FormGroup(
      {
        id: new FormControl((this.expenseToModify != undefined) ? this.expenseToModify.id : 0, []),
        expenseType: new FormControl((this.expenseToModify != undefined) ? this.expenseToModify.expenseType : null,
          [Validators.required]),
        description: new FormControl((this.expenseToModify != undefined) ? this.expenseToModify.description : null, []),
        amount: new FormControl((this.expenseToModify != undefined) ? this.expenseToModify.amount : null,
          [Validators.required]),
        date: new FormControl((this.expenseToModify != undefined) ? this.expenseToModify.date : null,
          [Validators.required]),
        hostel: new FormControl((this.expenseToModify != undefined) ? this.expenseToModify.hostel.name : null,
          [Validators.required])
      }
    )
  }

  getHostels() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/hostel/find-all-hostels-by-user-no-pagination';
    const hostels = this.protectedService.getAllHostelsByUser(url, userId).subscribe(
      (data) => {
        if (data.errors) {
          tap(() => this.snackbar.open(data.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.hostels = data.data;
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

  createOrModifyExpense() {
    if (this.expenseForm.invalid)
      return;

    if (this.expenseForm.value.id > 0) {
      this.modifyExpense();
    } else {
      this.createExpense();
    }
  }

  async modifyExpense() {
    const expense = this.getExpenseObject(this.expenseForm.value);
    console.log(JSON.stringify(expense));
    this.protectedService.updateRecord(environment.API_URL + '/api/v1/expense/modify-expense/' + expense.id, expense).pipe(
      tap((res: Response) => {
        if (res.errors) {
          this.snackbar.open(res.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
        } else {
          this.router.navigate(['expense']);
          this.snackbar.open('Expense Modified Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
        }
      })
    ).subscribe();
    this.protectedService.expenseToModify = undefined;
  }

  async createExpense() {
    const expense = this.getExpenseObject(this.expenseForm.value);
    this.protectedService.createRecord(environment.API_URL + '/api/v1/expense/create-expense', expense).pipe(
      tap((res: Response) => {
        if (res.errors) {
          this.snackbar.open(res.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          })
        } else {
          this.router.navigate(['expense']);
          this.snackbar.open('Expense Created Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
        }
      })
    ).subscribe();
  }

  getExpenseObject(value: any) {
    const _expense: Expense = {
      id: value.id,
      expenseType: value.expenseType,
      description: value.description,
      amount: value.amount,
      date: value.date,
      hostel: (this.expenseToModify != undefined) ? this.expenseToModify.hostel : value.hostel
    }
    return _expense;
  }

  backToExpenses() {
    this.router.navigate(['expense']);
  }
}
