import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LOCALSTORAGE_CURRENT_USER } from 'src/app/constants';
import { Hostel } from 'src/app/public/interfaces';
import { environment } from 'src/environments/environment';
import { ProtectedService } from '../../protected.service';
import { Response } from 'src/app/public/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-hostel',
  templateUrl: './create-hostel.component.html',
  styleUrls: ['./create-hostel.component.scss']
})
export class CreateHostelComponent {

  public createHostelForm: FormGroup;
  hostelTypes = [
    {id: 'MEN', value: 'MENS - Mens Hostel'},
    {id: 'WOMEN', value: 'WOMENS - Womens Hostel'},
    {id: 'COLIVE', value: 'COLIVE - Living Together'},
  ];

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
  ) {
    this.createHostelForm = new FormGroup(
      {
        name: new FormControl(null, [Validators.required]),
        type: new FormControl(null, [Validators.required]),
        street: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        country: new FormControl(null, [Validators.required]),
        zipcode: new FormControl(null, [Validators.required])
      }
    )
  }

  async createHostel() {
    if(this.createHostelForm.invalid)
      return;

    const hostel = this.getHostelObject(this.createHostelForm.value);
    this.protectedService.createHostel(environment.API_URL + '/api/v1/hostel/create-hostel', hostel).pipe(
      tap((res: Response) => {
        if (res.error) {
          tap(() => this.snackbar.open(res.error[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
        } else {
          tap(() => this.snackbar.open('Hostel Crated Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
          this.router.navigate(['hostel']);
        }
      })
    ).subscribe();
    console.log(hostel);
  }

  getHostelObject(value : any){
    const _hostel : Hostel = {
      name: value.name,
      type: value.type,
      isActive: true,
      id: 0,
      contact: '',
      rooms: [],
      address: {
        street: value.street,
        city: value.city,
        state: value.state,
        country: value.country,
        zipcode: value.zipcode
      },
      owner: {
        id: Number((localStorage.getItem(LOCALSTORAGE_CURRENT_USER) !== null)
          ? localStorage.getItem(LOCALSTORAGE_CURRENT_USER)
          : "0"),
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        username: '',
        mobile: '',
        referralCode: '',
        referredByCode: '',
        points: 0
      }
    }
    return _hostel;
  }

  backToHostels() {
    this.router.navigate(['hostel']);
  }

}
