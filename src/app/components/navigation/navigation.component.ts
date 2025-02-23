import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/model/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  authService = inject(AuthService)

  isAdmin = toSignal(this.authService.isAdmin$);

  signout(): void {
    this.authService.logout();
  }
}
