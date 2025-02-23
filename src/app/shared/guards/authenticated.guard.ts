import { inject } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from '../../services/auth/auth-api.service';

export const authenticatedGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthApiService);
  const router = inject(Router)
  return authService.user$.pipe(
    map(user => {
      if(user.id){
        return true;
      }

      router.navigateByUrl('auth');
      return false;
    }))
};
