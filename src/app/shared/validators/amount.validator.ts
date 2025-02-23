
import { inject } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { AuthService } from "../../services/auth/model/auth.service";
import { of } from "rxjs";
import { User } from '../../services/auth/model/types';

export const amountValidator = () => {
  const authService = inject(AuthService);
  let user = null as unknown as User;
  authService.user$.subscribe(u => user = u) ;

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return user.accountAmount < control.value ? { amount: true } : null
  }
}
