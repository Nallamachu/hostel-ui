import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALSTORAGE_TOKEN_KEY } from 'src/app/constants';

export interface Room {
  "brand":string,
  "chasis":string,
  "engine":string,
  "model":string,
  "type":string,
  "hp":string
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})

export class RoomComponent {

  ngOnInit() {
    if (localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) == undefined ) {
      this.router.navigate(['login']);
    } else {
      this.getAllRooms();
    }
  }

  constructor(
    private router: Router
  ) {}

  rooms: Room[] = [
    {
      "brand":"XCMG",
      "chasis":"42342",
      "engine":"232223",
      "model":"2022",
      "type":"Excavator",
      "hp":"210"
    },
    {
      "brand":"HYUNDAI",
      "chasis":"453543",
      "engine":"3453453",
      "model":"2017",
      "type":"Excavator",
      "hp":"140"
    }
  ]

  displayedColumns = ["brand", "chasis", "engine", "model", "type", "hp"];

  getAllRooms() {
    return this.rooms;
  }
}
