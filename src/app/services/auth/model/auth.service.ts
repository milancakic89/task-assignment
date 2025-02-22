import { AuthApiService } from './../api/auth-api.service';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from './types';
import { tap, filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private _user$ = new BehaviorSubject<User>(null as unknown as User);

  authApiService = inject(AuthApiService);

  user$ = this._user$.asObservable();

  isAdmin$ = this.user$.pipe(
    filter(Boolean),
    map(user => user.email === "test@test.com" && user.password === "test12345")
  )

  logIn(email: string, password: string): Observable<User | null> {
    return this.authApiService.signIn(email, password).pipe(
      tap(user => {
        if(user){
          this._user$.next(user);
        }
      })
    )
  }
}
