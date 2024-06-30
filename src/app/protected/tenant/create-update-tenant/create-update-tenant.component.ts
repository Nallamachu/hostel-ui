import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { every, map, of, tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER } from 'src/app/constants';
import { Room, Tenant } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../../protected.service';
import { Response } from 'src/app/public/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { Validations } from '../../validations';

@Component({
  selector: 'app-create-update-tenant',
  templateUrl: './create-update-tenant.component.html',
  styleUrls: ['./create-update-tenant.component.scss']
})
export class CreateUpdateTenantComponent {
  public tenantForm: FormGroup;
  tenantToModify!: Tenant | undefined;

  rooms: any = [];
  filteredRooms: any = [];
  hostels: any = [];

  idTypes = [
    { id: 'ADHAAR', value: 'Adhaar Card' },
    { id: 'DRIVING LICENSE', value: 'Driving License' },
    { id: 'VOTER ID', value: 'Voter Card' },
    { id: 'PASSPORT', value: 'Passport' }
  ];
  hasVacancy: boolean = false as boolean;

  ngOnInit() {
    if (this.tenantToModify != undefined && this.tenantToModify.room != undefined
      && this.tenantToModify.room.hostel != undefined) {
      this.hostels.push(this.tenantToModify.room.hostel);
      this.getAllRoomsByHostelId(this.tenantToModify.room.hostel.id);
    } else {
      this.getHostelAndRoomDetails();
    }
  }

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-IN');
    if (protectedService.tenantToModify != null) {
      this.tenantToModify = protectedService.tenantToModify;
    }
    this.tenantForm = new FormGroup(
      {
        id: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.id : 0),
        hostel: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.room.hostel.name : null,
          [Validators.required]),
        room: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.room.id : null,
          [Validators.required]),
        firstName: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.firstName : null,
          [Validators.required]),
        middleName: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.middleName : null, []),
        lastName: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.lastName : null,
          [Validators.required]),
        mobile: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.mobile : null,
          [Validators.required]),
        idNumber: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.idNumber : null,
          [Validators.required]),
        idType: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.idType : null,
          [Validators.required]),
        entryDate: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.entryDate : null,
          [Validators.required]),
        exitDate: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.exitDate : null, []),
        isActive: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.isActive : false, []),
        //ADDRESS
        street: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.address.street : null,
          [Validators.required]),
        city: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.address.city : null,
          [Validators.required]),
        state: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.address.state : null,
          [Validators.required]),
        country: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.address.country : null,
          [Validators.required]),
        zipcode: new FormControl((this.tenantToModify != undefined) ? this.tenantToModify.address.zipcode : null,
          [Validators.required])
      },{
        validators: Validations.validZipcode
      }
    );
  }

  createOrModifyTenant() {
    if (this.tenantForm.invalid)
      return;

    if (this.tenantForm.value.id > 0) {
      this.modifyTenant();
    } else {
      this.createTenant();
    }
  }

  async modifyTenant() {
    let tenant = this.getTenantObject(this.tenantForm.value);
    this.protectedService.updateRecord(environment.API_URL + '/api/v1/tenant/modify-tenant/' + tenant.id, tenant)
      .pipe(
        tap((res: Response) => {
          if (res.errors) {
            this.snackbar.open((res.errors[0].message.length>100)?res.errors[0].message.substring(0, 99):res.errors[0].message, 'Close', {
              duration: 5000, horizontalPosition: 'center', verticalPosition: 'top'
            });
          } else {
            this.router.navigate(['tenant']);
            this.snackbar.open('Tenant Modified Successfully', 'Close', {
              duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'
            });
            this.protectedService.tenantToModify = undefined;
          }
        })
      ).subscribe();
  }

  getAllRoomsByHostelId(hostelId: number) {
    this.protectedService.getAllRoomsByHostelId(environment.API_URL + '/api/v1/room/rooms-by-hostel-id', hostelId)
      .subscribe(
        (roomsData) => {
          this.filteredRooms = roomsData.data;
          if (this.filteredRooms == null || this.filteredRooms.length == 0) {
            this.snackbar.open('No Rooms Found For Given Hostel Id ' + hostelId, 'Close', {
              duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'
            });
            return of(false);
          }
        }
      );
  }

  getHostelAndRoomDetails() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null)
      ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    this.protectedService.getAllHostelsByUser(environment.API_URL + '/api/v1/hostel/find-all-hostels-by-user-no-pagination', userId).subscribe(
      (data) => {
        this.hostels = data.data;
        if (this.hostels == null) {
          this.snackbar.open('No Hostels Found. Create New Hostel.', 'Close', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'
          });
          return of(false);
        } else {
          this.protectedService.getAllRoomsByUserId(environment.API_URL + '/api/v1/room/rooms-by-user-id', userId)
            .subscribe(
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

  filterRooms(hostelId: number) {
    this.filteredRooms = [];
    if (hostelId > 0) {
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
    const tenant = this.getTenantObject(this.tenantForm.value);
    this.protectedService.createRecord(environment.API_URL + '/api/v1/tenant/create-tenant', tenant).pipe(
      tap((res: Response) => {
        if (res.errors) {
          this.snackbar.open((res.errors[0].message.length > 100) ? res.errors[0].message.substring(0, 99) : res.errors[0].message, 'Close', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'top'
          })
        } else {
          this.router.navigate(['tenant']);
          this.snackbar.open('Tenant Created Successfully', 'Close', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'
          })
        }
      })
    ).subscribe();
  }

  getTenantObject(value: any) {
    const _tenant: Tenant = {
      id: value.id,
      firstName: value.firstName,
      middleName: value.middleName,
      lastName: value.lastName,
      mobile: value.mobile,
      idNumber: value.idNumber,
      idType: value.idType,
      entryDate: value.entryDate,
      exitDate: value.exitDate,
      isActive: value.isActive,
      address: {
        street: value.street,
        city: value.city,
        state: value.state,
        country: value.country,
        zipcode: value.zipcode
      },
      room: this.filteredRooms.filter((room:any) => room.id == value.room)[0],
      payments: []
    }
    return _tenant;
  }

  backToTenants() {
    this.protectedService.tenantToModify = undefined;
    this.router.navigate(['tenant']);
  }

  activeTenants: number = 0;
  isRoomHasVacancy(room: Room) {
    this.activeTenants = 0;
    this.hasVacancy = false as boolean;
    this.protectedService.getAllActiveTenantsByRoomId(environment.API_URL + '/api/v1/tenant/tenants-count-by-room-id', room.id)
      .subscribe(
        (data: any) => {
          map((data: Response) => this.activeTenants = data.data)
          console.log(this.activeTenants);
        }
      );
    console.log('current active tenants ' + this.activeTenants);
    if (room.capacity > this.activeTenants) {
      this.hasVacancy = true as boolean;
    }
  }
}
