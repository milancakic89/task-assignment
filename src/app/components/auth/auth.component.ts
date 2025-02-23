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
import { LoginInfo, User } from '../../services/auth/model/types';
import { AuthService } from '../../services/auth/model/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { passwordValidator } from '../../shared/validators/password.validator';
import { Popover } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { map, tap } from "rxjs/operators";

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
  authService = inject(AuthService);
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
    this.authService.signIn(email, password).subscribe((user) => {
      this.submitting.set(false);
      if (user) {
        this.router.navigateByUrl('home');
      } else {
        this.messageService.add({severity: 'error', summary: 'Login failed', detail: `User not found`, life: 2000});
      }
    });
  }

  onSignUp(): void {
    this.submitting.set(true);
    const user = this.signupForm.value as User;
    this.authService.signUp(user).subscribe((user) => {
      if (user) {
        this.showSignUpModal = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `You can now sign in`, life: 2000});
      }
      this.submitting.set(false);
    });
  }
}
