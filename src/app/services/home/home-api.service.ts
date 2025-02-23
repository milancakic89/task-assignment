import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { filter, tap } from 'rxjs/operators';
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { API_URL } from '../../app.config';
import { AuthApiService } from '../auth/auth-api.service';
import { User } from '../../shared/interfaces/user.types';

@Injectable({providedIn: 'root'})
export class HomeApiService {
    baseUrl = inject(API_URL);

    http = inject(HttpClient);
    messageService = inject(MessageService);
    authService = inject(AuthApiService);

    user = toSignal(this.authService.user$.pipe(filter(Boolean)));


    changeAmount(amount: number): Observable<any> {
      return this.http.patch<User>(`${this.baseUrl}/users/${this.user()?.id}`, { accountAmount: amount }).pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error,
            life: 3000,
          });
          throw err;
        }),
         filter(Boolean),
         tap(updatedUser => this.authService.updateUser(updatedUser))
      );
  }
}
