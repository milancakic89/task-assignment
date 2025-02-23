
import { inject } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { AdminService } from "../../services/admin-panel/admin-api.service";
import { AuthApiService } from "../../services/auth/auth-api.service";
import { User } from "../interfaces/user.types";

export const amountValidator = () => {
  const authService = inject(AuthApiService);

  let user = null as unknown as User;
  let isAdmin = false;

  authService.user$.subscribe(u => user = u);
  authService.isAdmin$.subscribe(admin => isAdmin = admin);


  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if(isAdmin){
      return null;
    }
    return user.accountAmount < control.value ? { amount: true } : null;
  }
}
