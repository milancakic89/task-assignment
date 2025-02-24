import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, inject } from '@angular/core';
import { Component } from '@angular/core';
import { AuthApiService } from '../../services/auth/auth-api.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  authService = inject(AuthApiService)

  isAdmin = toSignal(this.authService.isAdmin$);

  isLoggedIn = toSignal(this.authService.isLoggedIn$);

  signout(): void {
    this.authService.logout();
  }
}
