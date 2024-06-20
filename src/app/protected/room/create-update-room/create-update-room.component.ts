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
  
  ngOnInit() {
    this.getHostels();
  }

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
  ) {
    this.roomForm = new FormGroup(
      {
        roomNo: new FormControl(null, [Validators.required]),
        floorNo: new FormControl(null, [Validators.required]),
        capacity: new FormControl(null, [Validators.required]),
        hostel: new FormControl(null, [Validators.required])
      }
    )
  }

  async createRoom() {
    if(this.roomForm.invalid)
      return;

    const room = this.getRoomObject(this.roomForm.value);
    this.protectedService.createHostel(environment.API_URL + '/api/v1/room/create-room', room).pipe(
      tap((res: Response) => {
        if (res.error != null && res.error.length > 0) {
          tap(() => this.snackbar.open(res.error[0].message, 'Close', {
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

  getRoomObject(value : any){
    const _room : Room = {
      roomNo: value.roomNo,
      floorNo: value.floorNo,
      capacity: value.capacity,
      id: 0,
      hostel: value.hostel
    }
    return _room;
  }

  backToRooms() {
    this.router.navigate(['room']);
  }

}
