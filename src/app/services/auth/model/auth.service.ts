import { AuthApiService } from './../api/auth-api.service';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from './types';
import { tap, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);

  authApiService = inject(AuthApiService);
  router = inject(Router)

  user$ = this._user$.asObservable();

  isAdmin$ = this.user$.pipe(
    filter(Boolean),
    map(user => user.email === "test@test.com" && user.password === "test12345")
  )

  signIn(email: string, password: string): Observable<User | null> {
    return this.authApiService.signIn(email, password).pipe(
      tap(user => {
        if(user){
          this._user$.next(user);
        }
      })
    )
  }

  signUp(user: User): Observable<User | null> {
    return this.authApiService.signUp(user)
  }

  logout(): void {
    this._user$.next(null);
    this.router.navigateByUrl('auth');
  }
}
