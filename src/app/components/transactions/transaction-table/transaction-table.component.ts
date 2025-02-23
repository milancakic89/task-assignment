import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Transaction } from '../../../shared/interfaces/transctions';
import { DialogModule } from 'primeng/dialog';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, ButtonModule, ButtonModule, DialogModule, AddTransactionComponent],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionTableComponent {
  @Input() transactions: Transaction[] = [];
  @Output() updateTransaction = new EventEmitter<Transaction>();
  @Output() deleteTransaction = new EventEmitter<Transaction>();
  @Output() dialogClosed = new EventEmitter();

  showDialog = false;
  transaction: Transaction = null as unknown as Transaction;

  onUpdateTransaction(transaction: Transaction): void {
    this.showDialog = false;
    this.updateTransaction.emit(transaction)
  }

  onEditTransaction(transaction: Transaction): void {
    this.transaction = transaction;
    this.showDialog = true;
  }

  onDeleteTransaction(transaction: Transaction): void {
    this.deleteTransaction.emit(transaction)
  }

  onCloseDialog(): void {
    this.showDialog = false;
    this.dialogClosed.emit()
  }
}
