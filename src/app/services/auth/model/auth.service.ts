import { AuthApiService } from './../api/auth-api.service';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from './types';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private _user$ = new BehaviorSubject<User>(null as unknown as User);

  authApiService = inject(AuthApiService);

  user$ = this._user$.asObservable();

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
