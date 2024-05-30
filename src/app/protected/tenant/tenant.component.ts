import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss']
})
export class TenantComponent {
  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      //this.getAllRooms();
    }
  }

  constructor(
    private router: Router
  ) {}
}
