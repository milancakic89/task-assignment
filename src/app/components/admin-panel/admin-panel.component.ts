import { DialogModule } from 'primeng/dialog';
import { Component, OnInit } from '@angular/core';
import { User } from '../../services/auth/model/types';
import { ButtonModule } from 'primeng/button';
import { TransactionsComponent } from '../transactions/transactions.component';

@Component({
  selector: 'app-admin-panel',
  imports: [ButtonModule, DialogModule, TransactionsComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit{

  users: User[] = [];

  showDialog = false;

  ngOnInit(): void {

  }

  onViewUserTransactions(user: User) {

  }

  onDeleteUser(user: User) {

  }
}
