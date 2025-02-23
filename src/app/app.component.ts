import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavigationComponent } from './components/navigation/navigation.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastModule } from 'primeng/toast';
import { filter } from "rxjs/operators";
import { AuthApiService } from './services/auth/auth-api.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ToastModule, NavigationComponent,RouterModule, ButtonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthApiService);

  userSignal = toSignal(this.authService.user$.pipe(filter(user => user.id !== '')));

 }
