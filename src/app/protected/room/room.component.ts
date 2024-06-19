import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER, LOCALSTORAGE_HOSTEL_ID, LOCALSTORAGE_ROOM_ID, LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';
import { Room, Response } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../protected.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})

export class RoomComponent {

  protectedService = inject(ProtectedService);
  dataSource = new MatTableDataSource<Room>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  selectedHostelId = localStorage.getItem(LOCALSTORAGE_HOSTEL_ID);

  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      (this.selectedHostelId == undefined)
        ?this.getAllRoomsByUserId()
        :this.getAllRoomsByHostelId(this.selectedHostelId);
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
  
  rooms: Room[] = []

  displayedColumns = ["id", "roomNo", "floorNo", "capacity", "hostel", "actions"];

  getAllRoomsByHostelId(hostelId: any) {
    let url = environment.API_URL + '/api/v1/room/rooms-by-hostel-id';
    const rooms = this.protectedService.getAllRoomsByHostelId(url, hostelId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.dataSource = new MatTableDataSource<Room>(this.response.data);
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.log('Error while trying to fetch all hostels');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return rooms;
  }

  getAllRoomsByUserId() {
    var userId = Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null) ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER) : "0");
    let url = environment.API_URL + '/api/v1/room/rooms-by-user-id';
    const rooms = this.protectedService.getAllRoomsByUserId(url, userId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.error) {
          tap(() => this.snackbar.open(this.response.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
        } else {
          this.dataSource = new MatTableDataSource<Room>(this.response.data);
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.log('Error while trying to fetch all hostels');
        tap(() => this.snackbar.open(error, 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
        }))
      }
    );
    return rooms;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createRoom(){
    
  }

  deleteRoom(room: Room) {
    console.log(room);
  }
  modifyRoom(room: Room) {
    console.log(room);
  }

  gotoTenants(roomId:any) {
    localStorage.setItem(LOCALSTORAGE_ROOM_ID, roomId);
      this.router.navigate(['tenant']);
  }
}
