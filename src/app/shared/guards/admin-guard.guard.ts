import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthApiService } from '../../services/auth/auth-api.service';

export const adminGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthApiService);
  return authService.isAdmin$;
};
