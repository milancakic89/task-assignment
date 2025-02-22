import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/model/auth.service';

export const adminGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  return authService.isAdmin$;
};
