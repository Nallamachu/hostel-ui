import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    // Check if passwords are matching. If not then add the error 'passwordsNotMatching: true' to the form
    if ((password === passwordConfirm) && (password !== null && passwordConfirm !== null)) {
      return null;
    } else {
      return { passwordsNotMatching: true };
    }
  }

  static addressValidation(control: AbstractControl): ValidationErrors | null {
    const street = control.get('street')?.value;
    const city = control.get('city')?.value;
    const state = control.get('state')?.value;
    const country = control.get('country')?.value;
    const zipcode = control.get('zipcode')?.value;

    // Check if passwords are matching. If not then add the error 'passwordsNotMatching: true' to the form
    if(street === null || street === "") {
      return { street: true };
    } else if(city === null || city === ""){
      return { city: true };
    } else if(state === null || state === ""){
      return { state: true };
    } else if(country === null || country === ""){
      return { country: true };
    } else if(zipcode < 10000) {
      return { zipcode: true };
    } else {
      return null;
    }
  }

  static validZipcode(control: AbstractControl): ValidationErrors | null {
    const zipcode = control.get('zipcode')?.value;
    if(zipcode <= 0 || zipcode <100000) {
        return { zipcode: true };
    }
    return null;
}

}