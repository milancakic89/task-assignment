import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { map, filter, tap } from 'rxjs/operators';
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/model/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../auth/model/types';
import { API_URL } from '../../app.config';

@Injectable({providedIn: 'root'})
export class HomeApiService {
    baseUrl = inject(API_URL);

    http = inject(HttpClient);
    messageService = inject(MessageService);
    authService = inject(AuthService);

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
