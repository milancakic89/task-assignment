import { catchError } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { LoginInfo } from '../../services/auth/model/types';
import { AuthService } from '../../services/auth/model/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  visible = false;
  submitting = signal(false);

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  messageService = inject(MessageService);
  router = inject(Router);

  signinForm = this.fb.group({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),
    password: new FormControl('', {
      validators: [Validators.minLength(3), Validators.required],
      updateOn: 'blur',
    }),
  });

  signupForm = this.fb.group({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      asyncValidators: [userExistValidator()],
      updateOn: 'blur',
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      updateOn: 'blur',
    }),
  });

  onLogin() {
    this.submitting.set(true);
    const { email, password } = this.signinForm.value as LoginInfo;

    this.authService
      .logIn(email, password)
      .subscribe(user => {
        this.submitting.set(false)
        if(user){
          this.router.navigateByUrl('home')
          this.messageService.add({severity: 'success', summary: "Login Success",  detail: `Welcome ${user.name}`, life: 3000,});
        }else{
          this.messageService.add({severity: 'error', summary: "Login failed",  detail: `User not found`, life: 3000});
        }
      });
  }
}
