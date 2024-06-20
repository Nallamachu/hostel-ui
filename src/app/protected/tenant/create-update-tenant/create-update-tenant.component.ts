import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER } from 'src/app/constants';
import { Tenant } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../../protected.service';
import { Response } from 'src/app/public/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-create-update-tenant',
  templateUrl: './create-update-tenant.component.html',
  styleUrls: ['./create-update-tenant.component.scss']
})
export class CreateUpdateTenantComponent {
  public tenantForm: FormGroup;

  rooms: any = [];
  filteredRooms: any = [];
  hostels: any = [];

  idTypes = [
    { id: 'ADHAAR', value: 'Adhaar Card' },
    { id: 'DRIVING LICENSE', value: 'Driving License' },
    { id: 'VOTER ID', value: 'Voter Card' },
    { id: 'PASSPORT', value: 'Passport' }
  ];

  ngOnInit() {
    this.getHostelAndRoomDetails();
  }

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-IN');
    this.tenantForm = new FormGroup(
      {
        hostel: new FormControl(null, [Validators.required]),
        room: new FormControl(null, [Validators.required]),
        firstName: new FormControl(null, [Validators.required]),
        middleName: new FormControl(null, []),
        lastName: new FormControl(null, [Validators.required]),
        mobile: new FormControl(null, [Validators.required]),
        idNumber: new FormControl(null, [Validators.required]),
        idType: new FormControl(null, [Validators.required]),
        entryDate: new FormControl(null, [Validators.required]),
        exitDate: new FormControl(null, []),
        isActive: new FormControl(null, []),
        //ADDRESS
        street: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        country: new FormControl(null, [Validators.required]),
        zipcode: new FormControl(null, [Validators.required])
      }
    )
  }

  getHostelAndRoomDetails() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    this.protectedService.getAllHostelsByUser(environment.API_URL + '/api/v1/hostel/find-all-hostels-by-user-no-pagination', userId).subscribe(
      (data) => {
        this.hostels = data.data;
        if (this.hostels == null) {
          this.snackbar.open('No Hostels Found. Create New Hostel.', 'Close', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'
          });
          return of(false);
        } else {
          this.protectedService.getAllRoomsByUserId(environment.API_URL + '/api/v1/room/rooms-by-user-id', userId).subscribe(
            (roomsData) => {
              this.rooms = roomsData.data;
              if (this.rooms == null) {
                this.snackbar.open('No Rooms Found. Create New Room.', 'Close', {
                  duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'
                });
                return of(false);
              }
            }
          );
        }
      }
    );
  }

  filterRooms(hostelId : number) {
    console.log(hostelId);
    this.filteredRooms = [];
    if(hostelId != null){
      for (var i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].hostel.id == hostelId) {
          this.filteredRooms.push(this.rooms[i]);
        }
      }
    } else {
      this.snackbar.open('Kindly Select Any One Hostel', 'Close', {
        duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
      })
    }
    
    return this.filteredRooms;
  }

  async createTenant() {
    if (this.tenantForm.invalid)
      return;

    const tenant = this.getTenantObject(this.tenantForm.value);
    this.protectedService.createTenant(environment.API_URL + '/api/v1/tenant/create-tenant', tenant).pipe(
      tap((res: Response) => {
        if (res.error) {
          tap(() => this.snackbar.open(res.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
        } else {
          tap(() => this.snackbar.open('Tenant Created Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
          this.router.navigate(['tenant']);
        }
      })
    ).subscribe();
    console.log(tenant);
  }

  getTenantObject(value: any) {
    const _tenant: Tenant = {
      id: 0,
      firstName: value.firstName,
      middleName: value.middleName,
      lastName: value.lastName,
      mobile: value.mobile,
      idNumber: value.idNumber,
      idType: value.idType,
      entryDate: value.entryDate,
      exitDate: value.exitDate,
      isActive: true,
      address: {
        street: value.street,
        city: value.city,
        state: value.state,
        country: value.country,
        zipcode: value.zipcode
      },
      room: value.room,
      payments: []
    }
    return _tenant;
  }

  backToTenants() {
    this.router.navigate(['tenant']);
  }
}
