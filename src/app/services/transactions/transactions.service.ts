import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/model/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { API_URL } from '../../app.config';
import { Transaction } from '../../shared/interfaces/transctions';

@Injectable({ providedIn: 'root' })
export class TransactionsApiService {
  baseUrl = inject(API_URL);

  http = inject(HttpClient);
  messageService = inject(MessageService);
  authService = inject(AuthService);

  userSignal = toSignal(this.authService.user$);

  addTransaction(transaction: Transaction): Observable<Transaction | null> {
    const newTransaction: Transaction = {
      ...transaction,
      userId: this.userSignal()?.id as string,
    };
    return this.http.post<Transaction>(`${this.baseUrl}/transactions`, newTransaction).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error,
          life: 3000,
        });
        throw err;
      }),
      );
    }

    updateTransaction(transaction: Transaction): Observable<Transaction | null> {
      return this.http.put<Transaction>(`${this.baseUrl}/transactions/${transaction.id}`, transaction).pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error,
            life: 3000,
          });
          throw err;
        }),
        );
      }

    getTransactionsForUser(id: string): Observable<Transaction[] | null>{
       return this.http.get<Transaction[]>(`${this.baseUrl}/transactions?userId=${id}`).pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error,
            life: 3000,
          });
          throw err;
        }),
        )
    }

    deleteTransactionsById(id: string): Observable<Transaction | null>{
      return this.http.delete<Transaction>(`${this.baseUrl}/transactions/${id}`).pipe(
        tap(console.log),
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error,
            life: 3000,
          });
          throw err;
        }),
       )
   }
}
