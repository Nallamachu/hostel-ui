import { AbstractControl, ValidationErrors } from "@angular/forms";

export class Validations {

    static validZipcode(control: AbstractControl): ValidationErrors | null {
        const zipcode = control.get('zipcode')?.value;
        if(zipcode <= 0 || zipcode <100000) {
            return { zipcode: true };
        }
        return null;
    }

    static validAmount(control: AbstractControl): ValidationErrors | null {
        const amount = control.get('amount')?.value;
        if(amount <= 0) {
            return { amount: true };
        }
        return null;
    }

    static roomValidation(control: AbstractControl): ValidationErrors | null {
        const roomNo = control.get('roomNo')?.value;
        const floorNo = control.get('floorNo')?.value;
        const capacity = control.get('capacity')?.value;
    
        if(roomNo <= 0 || roomNo>=999) {
          return { roomNo: true };
        } else if(floorNo <= 0 || floorNo>=99) {
            return { floorNo: true };
        } else if(capacity <= 0 || capacity >= 10) {
            return { capacity: true };
        } else {
          return null;
        }
      }
  
}