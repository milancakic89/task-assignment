import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../model/types";
import { Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthApiService {
    baseUrl = 'http://localhost:3000';

    http = inject(HttpClient);
    messageService = inject(MessageService)

    signIn(email: string, password: string): Observable<User | null> {
        return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}&password=${password}`).pipe(
           catchError(err => {
            this.messageService.add({severity: 'danger',  detail: err.error, life: 3000});
            return of(null);
           }),
           map(res => res?.length ? res[0] : null)
        );
    }

    signUp(user: User): Observable<User | null> {
      return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
         catchError(err => {
          this.messageService.add({severity: 'danger',  detail: err.error, life: 3000});
          return of(null);
         }),
      );
  }
}
