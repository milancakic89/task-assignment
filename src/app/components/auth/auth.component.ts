import { Observable } from 'rxjs';
import { switchMap, take, catchError, filter } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { userExistValidator } from '../../shared/validators/user-exists.validator';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { passwordValidator } from '../../shared/validators/password.validator';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../services/auth/auth-api.service';
import { LoginInfo, User } from '../../shared/interfaces/user.types';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule ,
    ButtonModule,
    DialogModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    InputNumberModule,
    PopoverModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  showSignUpModal = false;

  fb = inject(FormBuilder);
  authService = inject(AuthApiService);
  messageService = inject(MessageService);
  router = inject(Router);

  signinForm = this.fb.group({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),
    password: new FormControl('', [Validators.required, passwordValidator()])
  });

  signupForm = this.fb.group({
    nameAndSurname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [userExistValidator()],
      updateOn: 'blur',
    }),
    signupPassword: new FormControl('', [Validators.required, passwordValidator()]),
    accountAmount: new FormControl(0, [Validators.required]),
  });

  constructor(private _cdr: ChangeDetectorRef){}

  onSignIn() {
    const { email, password } = this.signinForm.value as LoginInfo;
    this.authService.signIn(email, password).pipe(
      catchError(err => {
        throw err;
      })
    ).subscribe((user) => {
      if(user){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Welcome ${user?.nameAndSurname}`, life: 2000});
        this.redirectUser();
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `User not found`, life: 3000});
      }
    });
  }

  onSignUp(): void {
    const user = this.signupForm.value as User;
    this.authService.signUp(user).pipe(
      filter(Boolean),
      switchMap(user => this.autoLoginUser(user.email, user.password))
    ).subscribe(usr => {
      this.showSignUpModal = false;
      this._cdr.detectChanges();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Welcome ${usr?.nameAndSurname}`, life: 2000});
      this.redirectUser()
    });
  }

  autoLoginUser(email: string, password: string): Observable<User | null> {
    return this.authService.signIn(email, password);
  }

  redirectUser() {
    this.authService.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
      if (!isAdmin) {
        this.router.navigateByUrl('home');
      } else {
        this.router.navigateByUrl('admin-panel');
      }
    })
  }
}
