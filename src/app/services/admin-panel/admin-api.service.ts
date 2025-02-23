import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../app.config';
import { catchError } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../shared/interfaces/user.types';

@Injectable({ providedIn: 'root' })
export class AdminService {
  http = inject(HttpClient);
  baseUrl = inject(API_URL);
  messageService = inject(MessageService);

  private _editMode$ = new BehaviorSubject<boolean>(false);

  isEditMode$ = this._editMode$.asObservable();

  setEditMode(val: boolean): void {
    this._editMode$.next(val);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error,
          life: 3000,
        });
        throw err;
      })
    );
  }

  deleteUserById(id: string) {
    return this.http.delete<User>(`${this.baseUrl}/users/${id}`).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error,
          life: 3000,
        });
        throw err;
      })
    );
  }
}
