import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER } from 'src/app/constants';
import { Hostel, Room } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../../protected.service';
import { Response } from 'src/app/public/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-update-room',
  templateUrl: './create-update-room.component.html',
  styleUrls: ['./create-update-room.component.scss']
})
export class CreateUpdateRoomComponent {
  public roomForm: FormGroup;
  hostels!: Hostel[];
  roomToModify!: Room | undefined;

  ngOnInit() {
    this.getHostels();
  }

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
  ) {
    if (protectedService.roomToModify != null) {
      this.roomToModify = protectedService.roomToModify;
    }
    this.roomForm = new FormGroup(
      {
        id: new FormControl((this.roomToModify != undefined) ? this.roomToModify.roomNo : 0),
        roomNo: new FormControl((this.roomToModify != undefined) ? this.roomToModify.roomNo : null, [Validators.required]),
        floorNo: new FormControl((this.roomToModify != undefined) ? this.roomToModify.floorNo : null, [Validators.required]),
        capacity: new FormControl((this.roomToModify != undefined) ? this.roomToModify.capacity : null, [Validators.required]),
        hostel: new FormControl((this.roomToModify != undefined) ? this.roomToModify.hostel : null, [Validators.required])
      }
    );
  }

  createOrModifyRoom() {
    if (this.roomForm.invalid)
      return;

    if (this.roomForm.value.id > 0) {
      this.modifyRoom();
    } else {
      this.createRoom();
    }
  }

  async modifyRoom() {
    let room = this.getRoomObject(this.roomForm.value);
    this.protectedService.updateRecord(environment.API_URL + '/api/v1/room/modify-room/' + room.id, room).pipe(
      tap((res: Response) => {
        if (res.errors) {
          this.snackbar.open(res.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
        } else {
          this.router.navigate(['room']);
          this.snackbar.open('Room Modified Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
          this.protectedService.roomToModify = undefined;
        }
      })
    ).subscribe();
  }

  async createRoom() {
    const room = this.getRoomObject(this.roomForm.value);
    this.protectedService.createRecord(environment.API_URL + '/api/v1/room/create-room', room).pipe(
      tap((res: Response) => {
        if (res.errors != null && res.errors.length > 0) {
          tap(() => this.snackbar.open(res.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
        } else {
          this.router.navigate(['room']);
          tap(() => this.snackbar.open('Room Crated Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
        }
      })
    ).subscribe();
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

  getRoomObject(value: any) {
    const _room: Room = {
      roomNo: value.roomNo,
      floorNo: value.floorNo,
      capacity: value.capacity,
      id: value.id,
      hostel: (this.roomToModify == undefined) ? value.hostel : this.roomToModify?.hostel
    }
    return _room;
  }

  backToRooms() {
    this.protectedService.roomToModify = undefined;
    this.router.navigate(['room']);
  }

}
