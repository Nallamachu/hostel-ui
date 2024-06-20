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

  expenseTypes = [
    {id: 'RENT', value: 'RENT'},
    {id: 'SALARY', value: 'SALARY'},
    {id: 'GROCERIES', value: 'GROCERIES'},
    {id: 'VEGITABLES', value: 'VEGITABLES'},
    {id: 'REPAIRS', value: 'REPAIRS'},
    {id: 'POWER', value: 'POWER'},
    {id: 'OTHER', value: 'OTHER'}
  ];

  ngOnInit() {
    this.getHostels();
  }

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
  ) {
    this.expenseForm = new FormGroup(
      {
        expenseType: new FormControl(null, [Validators.required]),
        description: new FormControl(null, []),
        amount: new FormControl(null, [Validators.required]),
        date: new FormControl(null, [Validators.required]),
        hostel: new FormControl(null, [Validators.required])
      }
    )
  }

  getHostels() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/hostel/find-all-hostels-by-user-no-pagination';
    const hostels = this.protectedService.getAllHostelsByUser(url, userId).subscribe(
      (data) => {
        if(data.error) {
          tap(() => this.snackbar.open(data.error[0].message, 'Close', {
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

  async createExpense() {
    if(this.expenseForm.invalid)
      return;

    const expense = this.getExpenseObject(this.expenseForm.value);
    this.protectedService.createExpense(environment.API_URL + '/api/v1/expense/create-expense', expense).pipe(
      tap((res: Response) => {
        if (res.error) {
          tap(() => this.snackbar.open(res.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
        } else {
          tap(() => this.snackbar.open('Expense Crated Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
          this.router.navigate(['expense']);
        }
      })
    ).subscribe();
  }

  getExpenseObject(value : any){
    const _expense : Expense = {
      id: 0,
      expenseType: value.expenseType,
      description: value.description,
      amount: value.amount,
      date: value.date,
      hostel: value.hostel
    }
    return _expense;
  }

  backToExpenses() {
    this.router.navigate(['expense']);
  }
}
