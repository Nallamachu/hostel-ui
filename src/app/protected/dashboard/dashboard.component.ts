import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';

export interface Hostel {
  "id":number,
  "name":string,
  "type":string,
  "contact":string,
  "isActive":boolean,
  "rooms": [],
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "country": string,
    "zipcode": Number
  },
  "owner": String
}

export interface Tenant {
  "id" : number,
  "firstName": string,
  "middleName": string,
  "lastName": string,
  "mobile": string,
  "idType": string,
  "idProof": string,
  "entryDate": String,
  "exitDate": String,
  "isActive": boolean
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    }
  }

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {}

  hostels : Hostel[]= [
    {
      "id":1234,
      "name":"Sri Balaji PG",
      "type":"Mens",
      "contact":"+91 - 8712278483",
      "isActive":true,
      "rooms": [],
      "address": {
        street:"Nushif Mansion, Rahmat Gulshan Colony, PJR Nagar, Gachibowli",
        city: "Hyderabad", 
        state:"Telangana", 
        country: "India",
        zipcode: 500032
      },
      "owner": "Subbareddy Nallamachu"
    }
  ];

  tenants: Tenant[] = [
    {
      "id" : 12345,
      "firstName": "Subbareddy",
      "middleName": "",
      "lastName": "Nallamachu",
      "mobile": "+91-8712278483",
      "idType": "Aadhaar",
      "idProof": "534963122407",
      "entryDate": "2024-04-01",
      "exitDate": "",
      "isActive": true
    }
  ]

}
