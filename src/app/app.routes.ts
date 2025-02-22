import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { adminGuard } from './shared/guards/admin-guard.guard';
import { authenticatedGuard } from './shared/guards/authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authenticatedGuard]
    },
    {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [authenticatedGuard]
    },
    {
        path: 'admin-panel',
        component: AdminPanelComponent,
        canActivate: [authenticatedGuard, adminGuard]
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];
