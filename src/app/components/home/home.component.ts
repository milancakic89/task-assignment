import { ChangeDetectionStrategy, Component } from '@angular/core';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from "rxjs/operators";
import { HomeApiService } from '../../services/home/home-api.service';
import { MessageService } from 'primeng/api';
import { AuthApiService } from '../../services/auth/auth-api.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ButtonModule, DialogModule, InputNumberModule, ReactiveFormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  authService = inject(AuthApiService);
  fb = inject(FormBuilder);
  homeApiService = inject(HomeApiService);
  messageService = inject(MessageService);

  showDialog = false;

  user = toSignal(this.authService.user$);
  currentAmount = toSignal(this.authService.user$.pipe(map(user => user.accountAmount))) ;

  form = this.fb.group({
    accountAmount: new FormControl(this.currentAmount(), [Validators.required])
  });

  onSubmit(): void {
    this.homeApiService.changeAmount(this.form.value.accountAmount as number).subscribe(
      _ => {
        this.showDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Amount updated`, life: 2000});
      }
    )
  }
}
