import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    }
  }

  constructor(
    private router: Router
  ) {}
}
