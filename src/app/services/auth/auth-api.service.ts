import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { map, tap, take } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { API_URL } from '../../app.config';
import { User } from '../../shared/interfaces/user.types';

export const ANONYMOUS_USER: User = {
  id: '',
  nameAndSurname: '',
  email: '',
  password: '',
  accountAmount: 0
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  baseUrl = inject(API_URL);

  private _user$ = new BehaviorSubject<User>(ANONYMOUS_USER);

  messageService = inject(MessageService);
  http = inject(HttpClient);
  router = inject(Router)

  user$ = this._user$.asObservable();

  isAdmin$ = this.user$.pipe(
    map(user => user.email === "admin@kireygroup.com" && user.password === "Admin@kireygroup2025")
  )

  isLoggedIn$ = this.user$.pipe(map(user => user.id !== ANONYMOUS_USER.id))


  signIn(email: string, password: string): Observable<User | null> {
    const encodedPassword = encodeURIComponent(password);
    return this.http
      .get<User[]>(`${this.baseUrl}/users?email=${email}&password=${encodedPassword}`)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
            life: 3000,
          });
          throw err;
        }),
        map((res) => (res?.length ? res[0] : null)),
        tap(user => {
          if(user){
            this._user$.next(user)
          }
        })
      );
  }

  signUp(user: User): Observable<User | null> {
    return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error,
          life: 3000,
        });
        throw err;
      }),
    );
  }

  updateUser(user: User): void {
    this._user$.next(user);
  }

  logout(): void {
    this._user$.next(ANONYMOUS_USER);
    this.router.navigateByUrl('auth');
  }
}
