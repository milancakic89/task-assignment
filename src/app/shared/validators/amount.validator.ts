import { TransactionsApiService } from './../../services/transactions/transactions.service';

import { inject } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { AdminService } from "../../services/admin-panel/admin-api.service";
import { AuthApiService } from "../../services/auth/auth-api.service";

export const amountValidator = () => {
  const authService = inject(AuthApiService);
  const transactionService = inject(TransactionsApiService)

  let ballance = 0;
  let editValue = 0;
  let isAdmin = false;

  authService.user$.subscribe(user => ballance = user.accountAmount);
  authService.isAdmin$.subscribe(admin => isAdmin = admin);
  transactionService.transacionEditValue$.subscribe(editVal => editValue = editVal);


  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if(isAdmin){
      return null;
    }
    if(editValue){
      const newBallance = ballance + editValue;
      return newBallance < control.value ? { editAmount: true } : null;
    }
    return ballance < control.value ? { amount: true } : null;
  }
}
