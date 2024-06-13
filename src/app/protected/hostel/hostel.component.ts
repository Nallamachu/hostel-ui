import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALSTORAGE_TOKEN_KEY, LOCALSTORAGE_CURRENT_USER } from 'src/app/constants';
import { environment } from 'src/environments/environment'
import { ProtectedService } from '../protected.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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

@Component({
  selector: 'app-hostel',
  templateUrl: './hostel.component.html',
  styleUrls: ['./hostel.component.scss']
})
export class HostelComponent implements AfterViewInit{
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
	@ViewChild(MatSort)
  sorter!: MatSort;
  
  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      this.getHostels()
    }
  }

  constructor(
    private router: Router
  ) {}

  ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		//this.dataSource.sorter = this.sorter;
	}

  protectedService = inject(ProtectedService);
  dataSource = new MatTableDataSource<Hostel>();

  displayedColumns: string[] = ["id", "name", "type", "rooms", "owner", "contact", "isActive",  "address"];
  allHostels : Hostel[]= [];

  getHostels() {
    console.log(localStorage.getItem(LOCALSTORAGE_CURRENT_USER))
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER)!== null)? localStorage.getItem(LOCALSTORAGE_CURRENT_USER):"0");
		let url = environment.API_URL + '/api/v1/hostel/find-all-hostels-by-user';
		const hostels = this.protectedService.getHostels(url, userId).subscribe(
			(data) => {
        console.log(data);
				this.dataSource = new MatTableDataSource<Hostel>(data);
				this.dataSource.paginator = this.paginator;
			},
			(error1) => {
				console.log('Error while trying to fetch all hostels');
			}
		);
    return hostels;
	}
}
