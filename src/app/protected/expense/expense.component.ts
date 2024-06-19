import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER, LOCALSTORAGE_HOSTEL_ID, LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';
import { Expense, Response } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../protected.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
  
  protectedService = inject(ProtectedService);
  dataSource = new MatTableDataSource<Expense>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  selectedHostelId = localStorage.getItem(LOCALSTORAGE_HOSTEL_ID);

  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      (this.selectedHostelId == undefined)
        ?this.getAllExpensesByUserId()
        :this.getAllExpensesByHostelId(this.selectedHostelId);
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

  expenses: Expense[] = []

  displayedColumns = ["id", "expenseType", "description", "date", "amount", "hostel", "actions"];

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
          this.dataSource = new MatTableDataSource<Expense>(this.response.data);
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.log('Error while trying to fetch getAllExpensesByUserId');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return expenses;
  }

  getAllExpensesByHostelId(selectedHostelId: string) {
    let url = environment.API_URL + '/api/v1/expense/find-all-expenses-by-hostel-id';
    const expenses = this.protectedService.getAllExpensesByHostelId(url, selectedHostelId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.dataSource = new MatTableDataSource<Expense>(this.response.data);
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.log('Error while trying to fetch getAllExpensesByHostelId');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return expenses;
  }

  addExpense(){

  }

  deleteExpense(expense: Expense) {
    console.log(expense);
  }
  modifyExpense(expense: Expense) {
    console.log(expense);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  gotoExpense(expenseId:any){
    console.log(expenseId);
  }
}
