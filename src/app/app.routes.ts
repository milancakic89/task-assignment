import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'transactions',
        component: TransactionsComponent,
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];
