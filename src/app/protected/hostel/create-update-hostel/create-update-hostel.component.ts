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
  selector: 'app-create-update-hostel',
  templateUrl: './create-update-hostel.component.html',
  styleUrls: ['./create-update-hostel.component.scss']
})
export class CreateUpdateHostelComponent {

  public createHostelForm: FormGroup;
  hostelToModify : Hostel | undefined;

  hostelTypes = [
    {id: 'MEN', value: 'MENS'},
    {id: 'WOMEN', value: 'WOMENS'},
    {id: 'COLIVE', value: 'COLIVE'},
  ];

  constructor(
    private router: Router,
    private protectedService: ProtectedService,
    private snackbar: MatSnackBar,
  ) {
    this.createHostelForm = new FormGroup(
      {
        id: new FormControl(),
        name: new FormControl(null, [Validators.required]),
        type: new FormControl(null, [Validators.required]),
        isActive: new FormControl(),
        street: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        country: new FormControl(null, [Validators.required]),
        zipcode: new FormControl(null, [Validators.required]),
        owner: new FormControl()
      }
    )
    if(protectedService.hostelToModify != null){
      this.hostelToModify = protectedService.hostelToModify;
      this.fillTheForm(this.hostelToModify);
    }
  }

  fillTheForm(hostel: Hostel){
    this.createHostelForm.setValue({
      id:hostel.id,
      name: hostel.name,
      type: hostel.type,
      isActive: hostel.isActive,
      street: hostel.address.street,
      city: hostel.address.city,
      state: hostel.address.state,
      country: hostel.address.country,
      zipcode: hostel.address.zipcode,
      owner: hostel.owner
    });
  }

  createOrModifyHostel() {
    if(this.createHostelForm.invalid)
      return;

    if(this.createHostelForm.value.id != null || this.createHostelForm.value.id != undefined){
      this.modifyHostel();
    } else {
      this.createHostel();
    }
  }

  async modifyHostel() {
    const hostel = this.getHostelObject(this.createHostelForm.value);
    this.protectedService.updateRecord(environment.API_URL + '/api/v1/hostel/modify-hostel/'+ hostel.id, hostel).pipe(
      tap((res: Response) => {
        if (res.errors) {
          this.snackbar.open(res.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
        } else {
          this.router.navigate(['hostel']);
          this.snackbar.open('Hostel Modified Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          });
          this.protectedService.hostelToModify = undefined;
        }
      })
    ).subscribe();
  }

  async createHostel() {
    const hostel = this.getHostelObject(this.createHostelForm.value);
    hostel.owner.id = Number(localStorage.getItem(LOCALSTORAGE_CURRENT_USER));
    this.protectedService.createHostel(environment.API_URL + '/api/v1/hostel/create-hostel', hostel).pipe(
      tap((res: Response) => {
        if (res.errors) {
          tap(() => this.snackbar.open(res.errors[0].message, 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
        } else {
          tap(() => this.snackbar.open('Hostel Created Successfully', 'Close', {
            duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'
          }));
          this.router.navigate(['hostel']);
        }
      })
    ).subscribe();
  }

  getHostelObject(value : any){
    const _hostel : Hostel = {
      name: value.name,
      type: value.type,
      isActive: value.isActive,
      id: value.id,
      contact: '',
      rooms: [],
      address: {
        street: value.street,
        city: value.city,
        state: value.state,
        country: value.country,
        zipcode: value.zipcode
      },
      owner: (value.owner != null) ? value.owner : {
        id:0
      }
    }
    return _hostel;
  }

  backToHostels() {
    this.protectedService.hostelToModify = undefined;
    this.router.navigate(['hostel']);
  }

}
