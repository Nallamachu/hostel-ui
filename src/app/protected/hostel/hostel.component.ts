import { Component } from '@angular/core';

export interface Hostel {
  "site":string,
  "engineer":string,
  "company":string,
  "contact":string,
  "open":boolean
}

@Component({
  selector: 'app-hostel',
  templateUrl: './hostel.component.html',
  styleUrls: ['./hostel.component.scss']
})
export class HostelComponent {
  displayedColumns: string[] = ['site', 'engineer', 'company', 'contact'];
  activeSites : Hostel[]= [];
  allSites = [
    {
      "site":"Kamalapuram",
      "engineer":"Samba",
      "company":"SAND",
      "contact":"9502251950",
      "open":true
    },
    {
      "site":"Siddavatam",
      "engineer":"Ayyawar Reddy",
      "company":"SAND",
      "contact":"9502342250",
      "open":false
    },
    {
      "site":"Pushpagiri",
      "engineer":"Pardhu",
      "company":"SAND",
      "contact":"1234567786",
      "open":false
    },
    {
      "site":"Chennur",
      "engineer":"Shivareddy",
      "company":"SAND",
      "contact":"9502242350",
      "open":false
    }
  ]

  OnInit() {
    this.getActiveHostels()
    this.getAllHostels()
  }

  getActiveHostels() {
    this.activeSites = this.allSites.filter((site) => {
      return site.open === true;
    });
    return this.activeSites;
  }

  getAllHostels() {
    return this.allSites;
  }
}
