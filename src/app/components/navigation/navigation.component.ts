import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/model/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  authService = inject(AuthService)

  isAdmin = toSignal(this.authService.isAdmin$);
}
