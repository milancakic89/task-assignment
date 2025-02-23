import { catchError } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
import { Popover } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../services/auth/auth-api.service';
import { LoginInfo, User } from '../../shared/interfaces/user.types';

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
    Popover

  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  showSignUpModal = false;
  submitting = signal(false);

  fb = inject(FormBuilder);
  authService = inject(AuthApiService);
  messageService = inject(MessageService);
  router = inject(Router);

  signinForm = this.fb.group({
    email: new FormControl('test@test.com', {
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),
    password: new FormControl('test12345', [Validators.required])
  });

  signupForm = this.fb.group({
    nameAndSurname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [userExistValidator()],
      updateOn: 'blur',
    }),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    accountAmount: new FormControl(0, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
  });

  onSignIn() {
    this.submitting.set(true);
    const { email, password } = this.signinForm.value as LoginInfo;
    this.authService.signIn(email, password).pipe(
      catchError(err => {
        this.submitting.set(false);
        throw err;
      })
    ).subscribe((user) => {
      this.submitting.set(false);
      if(user){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Welcome ${user?.nameAndSurname}`, life: 2000});
        this.redirectUser();
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `User not found`, life: 3000});
      }
    });
  }

  onSignUp(): void {
    this.submitting.set(true);
    const user = this.signupForm.value as User;
    this.authService.signUp(user).subscribe(_ => {
      this.showSignUpModal = false;
      this.submitting.set(false);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `You can now sign in`, life: 2000});
    });
  }

  redirectUser() {
    this.authService.isAdmin$.subscribe(isAdmin => {
      if (!isAdmin) {
        this.router.navigateByUrl('home');
      } else {
        this.router.navigateByUrl('admin-panel');
      }
    })
  }
}
