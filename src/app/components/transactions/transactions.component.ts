import { MessageService } from 'primeng/api';
import { TransactionsApiService } from './../../services/transactions/transactions.service';
import { Component, Input, OnDestroy, OnInit, inject, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Transaction } from '../../shared/interfaces/transctions';
import { combineLatest, BehaviorSubject } from "rxjs";
import { map, switchMap, filter, tap } from "rxjs/operators";
import { TransactionTableComponent } from "./transaction-table/transaction-table.component";
import { CommonModule } from '@angular/common';
import { AddTransactionComponent } from "./add-transaction/add-transaction.component";
import { AuthApiService } from '../../services/auth/auth-api.service';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule, AddTransactionComponent, TransactionTableComponent],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private _newTransaction$ = new BehaviorSubject<Transaction>(null as  unknown as Transaction);
  private _allTransactions$ = new BehaviorSubject<Transaction[]>([]);

  @Input() id = '';
  @Output() destroyed = new EventEmitter<void>();

  authService = inject(AuthApiService);
  transactionApiService = inject(TransactionsApiService);
  messageService = inject(MessageService)

  showDialog = false;
  lockTransactions = false;

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

  onAddTransaction(transaction: Transaction): void {
    this.transactionApiService.addTransaction(transaction).subscribe(
      transaction => {
        this.showDialog = false;
        if(transaction){
          this._newTransaction$.next(transaction)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Transaction saved`, life: 2000});
        }
      }
    )
  }

  updateTransaction(transaction: Transaction){
    this.transactionApiService.updateTransaction(transaction).subscribe(
      transaction => {
        this.showDialog = false;
        if(transaction){
          this._newTransaction$.next(transaction)
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
          switchMap(user => {
            return this.transactionApiService.getTransactionsForUser(user.id).pipe(
              filter(Boolean),
              tap(transactions => this._allTransactions$.next(transactions))
            )
          }))
      }))
      .subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Transaction deleted`, life: 2000});
        }
    )
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

  ngOnDestroy(): void {
    this.destroyed.emit();
  }

}
