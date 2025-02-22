import { inject } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/model/auth.service';

export const authenticatedGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router)
  return authService.user$.pipe(
    map(user => {
      if(user){
        return true;
      }
      router.navigateByUrl('');
      return false;
    }))
};
