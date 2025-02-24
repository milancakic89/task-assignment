import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Transaction, TransactionChange } from '../../../shared/interfaces/transctions';
import { DialogModule } from 'primeng/dialog';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { TransactionsApiService } from '../../../services/transactions/transactions.service';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, ButtonModule, ButtonModule, DialogModule, AddTransactionComponent],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionTableComponent {
  transactionService = inject(TransactionsApiService);

  @Input() transactions: Transaction[] = [];
  @Output() updateTransaction = new EventEmitter<TransactionChange>();
  @Output() deleteTransaction = new EventEmitter<Transaction>();
  @Output() dialogClosed = new EventEmitter();

  showDialog = false;
  transaction: Transaction = null as unknown as Transaction;

  onUpdateTransaction(transactionChange: TransactionChange): void {
    this.showDialog = false;
    this.updateTransaction.emit(transactionChange)
  }

  onEditTransaction(transaction: Transaction): void {
    this.transactionService.setEditTransactionValue(transaction.amountSpent)
    this.transaction = transaction;
    this.showDialog = true;
  }

  onDeleteTransaction(transaction: Transaction): void {
    this.transaction = null as unknown as Transaction;
    this.deleteTransaction.emit(transaction)
  }

  onCloseDialog(): void {
    this.transactionService.setEditTransactionValue(0);
    this.showDialog = false;
    this.transaction = null as unknown as Transaction;
    this.dialogClosed.emit();

  }
}
