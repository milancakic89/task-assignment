import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthService } from './services/auth/model/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastModule } from 'primeng/toast';
import { filter } from "rxjs/operators";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ToastModule, NavigationComponent,RouterModule, ButtonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthService);

  userSignal = toSignal(this.authService.user$.pipe(filter(user => user.id !== '')));

 }
