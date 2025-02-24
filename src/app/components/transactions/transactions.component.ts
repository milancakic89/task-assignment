import { MessageService } from 'primeng/api';
import { TransactionsApiService } from './../../services/transactions/transactions.service';
import { Component, Input, OnDestroy, OnInit, inject, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Transaction, TransactionChange } from '../../shared/interfaces/transctions';
import { combineLatest, BehaviorSubject } from "rxjs";
import { map, switchMap, filter, tap, take } from "rxjs/operators";
import { TransactionTableComponent } from "../shared/transaction-table/transaction-table.component";
import { CommonModule } from '@angular/common';
import { AddTransactionComponent } from "../shared/add-transaction/add-transaction.component";
import { AuthApiService } from '../../services/auth/auth-api.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { User } from '../../shared/interfaces/user.types';
import { HomeApiService } from '../../services/home/home-api.service';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule, AddTransactionComponent, TransactionTableComponent, ConfirmDialogComponent],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent implements OnInit {
  authService = inject(AuthApiService);
  transactionApiService = inject(TransactionsApiService);
  messageService = inject(MessageService);
  homeService = inject(HomeApiService);

  private _newTransaction$ = new BehaviorSubject<Transaction>(null as  unknown as Transaction);
  private _allTransactions$ = new BehaviorSubject<Transaction[]>([]);

  @Input() id = '';


  showDialog = false;
  lockTransactions = false;

  showConfirm = false;

  selectedTransaction: Transaction | null = null;

  transactions$ = combineLatest([this._allTransactions$, this._newTransaction$]).pipe(
    filter(() => this.lockTransactions !== true),
    map(([transactions, newTransaction]) => {
      if(newTransaction){
        const existingTransaction = transactions.find(t => t.id === newTransaction.id);
        if(existingTransaction){
          const updatedTransactions = transactions.map(item => {
            if(item.id === existingTransaction.id){
               return {...newTransaction };
            }
            return item;
          });
          return this._executeInLock([...updatedTransactions]);
        }
        return this._executeInLock([...transactions, newTransaction]);
      }
      return transactions;
    })
  );

  ngOnInit(): void {
    this._fetchTransactions(this.id).pipe(
      filter(Boolean),
      tap(transactions => this._allTransactions$.next(transactions))
    ).subscribe()

  }

  onAddTransaction(transactionChange: TransactionChange): void {
    this.transactionApiService.addTransaction(transactionChange.transaction).subscribe(
      transaction => {
        this.showDialog = false;
        if(transaction){
          this.updateAccountAmount(transactionChange);
          this._newTransaction$.next(transaction)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Transaction saved`, life: 2000});
        }
      }
    )
  }

  updateTransaction(transactionChange: TransactionChange){
    this.transactionApiService.updateTransaction(transactionChange.transaction).subscribe(
      transaction => {
        this.showDialog = false;
        if(transaction){
          this._newTransaction$.next(transaction);
          this.updateAccountAmount(transactionChange);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Transaction updated`, life: 2000});
        }
      }
    )
  }

  deleteTransaction(transaction: Transaction): void {
    this.transactionApiService.deleteTransactionsById(transaction.id)
    .pipe(
      switchMap(_ => {
        return this.authService.user$.pipe(
          take(1),
          switchMap(user => {
            const id = this.id || user.id;
            return this.transactionApiService.getTransactionsForUser(id).pipe(
              filter(Boolean),
              tap(transactions => this._allTransactions$.next(transactions))
            )
          }))
      }))
      .subscribe(
        () => {
          this.selectedTransaction = null;
          const transactionChange: TransactionChange = {
            transaction: {
              ...transaction,
              amountSpent: 0
            },
            previousAmount: transaction.amountSpent
          }
          this.updateAccountAmount(transactionChange);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Transaction deleted`, life: 2000});
        }
    )
  }

  updateAccountAmount(transactionChange: TransactionChange):void {
    this.authService.isAdmin$.pipe(
      take(1),
      filter(admin => !admin && this.lockTransactions === false),
      switchMap(_ => {
        return this.authService.user$.pipe(
            take(1),
            switchMap(user => {
              const newBalance = user.accountAmount + transactionChange.previousAmount - transactionChange.transaction.amountSpent;
              return this.homeService.changeAmount(newBalance);
            })
            )
      })
    ).subscribe()
  }

  markForDelete(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.showConfirm = true;
  }

  onDialogConfirm(){
    this.showConfirm = false;
    this.deleteTransaction(this.selectedTransaction as Transaction)
  }

  onDialogCancel(){
    this.showConfirm = false;
    this.selectedTransaction = null;
  }

  private _fetchTransactions(id: string){
    if(this.id){
      return this.transactionApiService.getTransactionsForUser(id)
    }
    return  this.authService.user$.pipe(
      switchMap(user => {
        return this.transactionApiService.getTransactionsForUser(user.id).pipe(
          filter(Boolean),
          tap(transactions => this._allTransactions$.next(transactions))
        )
      })
    )
  }

  private _executeInLock(transactions: Transaction[]): Transaction[] {
    this.lockTransactions = true;
    this._newTransaction$.next(null as unknown as Transaction);
    this._allTransactions$.next(transactions);
    this.lockTransactions = false;
    return transactions;
  }
}
