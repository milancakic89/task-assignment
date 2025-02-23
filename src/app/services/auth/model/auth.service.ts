import { AuthApiService } from './../api/auth-api.service';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from './types';
import { tap, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export const ANONYMOUS_USER: User = {
  id: '',
  nameAndSurname: '',
  email: '',
  password: '',
  accountAmount: 0
}

@Injectable({ providedIn: 'root'})
export class AuthService {
  private _user$ = new BehaviorSubject<User>(ANONYMOUS_USER);

  authApiService = inject(AuthApiService);
  router = inject(Router)

  user$ = this._user$.asObservable();

  isAdmin$ = this.user$.pipe(
    map(user => user.email === "test@test.com" && user.password === "test12345")
  )

  signIn(email: string, password: string): Observable<User | null> {
    return this.authApiService.signIn(email, password).pipe(
      tap(user => {
        if(user){
          this.updateUser(user);
        }
      })
    )
  }

  signUp(user: User): Observable<User | null> {
    return this.authApiService.signUp(user)
  }

  updateUser(user: User): void {
    this._user$.next(user);
  }

  logout(): void {
    this._user$.next(ANONYMOUS_USER);
    this.router.navigateByUrl('auth');
  }
}
