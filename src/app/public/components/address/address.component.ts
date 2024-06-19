import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {

  public addressForm: FormGroup;

  constructor() {
    this.addressForm = new FormGroup(
      {
        street: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        country: new FormControl(null, [Validators.required]),
        zipcode: new FormControl(null, [Validators.required])
      }
    );
  }
}
