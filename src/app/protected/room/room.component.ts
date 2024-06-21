import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER, LOCALSTORAGE_HOSTEL_ID, LOCALSTORAGE_ROOM_ID, LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';
import { Room, Response, Tenant } from 'src/app/public/interfaces';
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
    this.protectedService.roomToModify = undefined;
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
    errors: []
  };
  
  rooms: Room[] = []

  displayedColumns = ["id", "roomNo", "floorNo", "capacity", "hostel", "actions"];

  getAllRoomsByHostelId(hostelId: any) {
    let url = environment.API_URL + '/api/v1/room/rooms-by-hostel-id';
    const rooms = this.protectedService.getAllRoomsByHostelId(url, hostelId).subscribe(
      (data) => {
        this.response = data;
        if(this.response.errors) {
          tap(() => this.snackbar.open(this.response.errors[0].message, 'Close', {
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
        if(this.response.errors) {
          tap(() => this.snackbar.open(this.response.errors[0].message, 'Close', {
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
    this.router.navigate(['create-update-room']);
  }
  
  deleteRoom(room: Room) {
    this.protectedService.getAllTenantsByRoomNo(environment.API_URL+'/api/v1/tenant/tenants-by-room-no', room.roomNo).subscribe(
      (data) => {
        this.response = data;
        if(this.response.errors) {
          tap(() => this.snackbar.open(this.response.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }))
          return of(false);
        } else if(this.response.data != null && this.response.data.length > 0){
          if(this.response.data.length > 0) {
            this.snackbar.open('Room is not empty. Cannot be deleted.', 'Close', {
              duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
            });
            return of(false);
          }
        } else {
          let url = environment.API_URL + '/api/v1/room/delete-room-by-id/';
          if(window.confirm('Are you sure you want to delete the room of ' + room.roomNo + '?')){
            return this.protectedService.deleteRecord(url+room.id).subscribe(
              (data) => {
                if(data.errors) {
                  tap(() => this.snackbar.open(data.errors[0].message, 'Close', {
                    duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
                  }))
                } else {
                  this.deleteRowDataTable (room.id,  this.paginator, this.dataSource);
                }
              },
              (error) => {
                console.log('Error while trying to fetch all hostels');
                tap(() => this.snackbar.open(error, 'Close', {
                  duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
                }))
              }
            );
          }
        }
      }
    );
  }

  private deleteRowDataTable (recordId:number, paginator: any, dataSource: any) {
    const itemIndex = dataSource.data.findIndex((obj:any) => obj['id'] === recordId);
    dataSource.data.splice(itemIndex, 1);
    dataSource.paginator = paginator;
  }

  modifyRoom(room: Room) {
    this.protectedService.roomToModify = room;
    this.router.navigate(['create-update-room']);
  }

  gotoTenants(roomId:any) {
    localStorage.setItem(LOCALSTORAGE_ROOM_ID, roomId);
      this.router.navigate(['tenant']);
  }
}
