import { CommonModule } from '@angular/common';
import { combineLatest, BehaviorSubject } from "rxjs";
import { map, filter } from "rxjs/operators";
import { DialogModule } from 'primeng/dialog';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TransactionsComponent } from '../transactions/transactions.component';
import { AdminService } from '../../services/admin-panel/admin-api.service';
import { MessageService } from 'primeng/api';
import { AuthApiService } from '../../services/auth/auth-api.service';
import { User } from '../../shared/interfaces/user.types';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, TransactionsComponent, ConfirmDialogComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPanelComponent implements OnInit{
  adminService = inject(AdminService);
  messageService = inject(MessageService);
  authService = inject(AuthApiService);

  private _deleteId$ = new BehaviorSubject<string | null>(null);
  private _allUsers$ = new BehaviorSubject<User[]>([]);

  showDialog = false;
  showConfirmDialog = false;
  lockUsers = false;
  adminUser = null as unknown as User;
  viewUser: User | null = null;
  selectedUserForDelete: User | null = null;

  users$ = combineLatest([this._allUsers$, this._deleteId$]).pipe(
    filter(_ => this.lockUsers !== true),
    map(([users, deleteId]) => {
      const refreshedUsers = users.filter(u => u.id !== deleteId && u.id !== this.adminUser.id);
      return this._updateInLock(refreshedUsers);
    })
  );


  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.adminUser = user;
    })
    this.adminService.getUsers().subscribe(users => {
      this._allUsers$.next(users);
    })
  }

  onViewUserTransactions(user: User) {
    this.adminService.setEditMode(true);
    this.viewUser = user;
    this.showDialog = true;
  }

  onCloseDialog(): void {
    this.adminService.setEditMode(false);
    this.showDialog = false;
    this.viewUser = null;
  }

  onDeleteUser(user: User) {
    this.adminService.deleteUserById(user.id).subscribe(res => {
      this._deleteId$.next(res.id);
      this.selectedUserForDelete = null;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `User deleted`, life: 2000});
    })
  }

  onMarkForDelete(user: User): void {
    this.selectedUserForDelete = user;
    this.showConfirmDialog = true;
  }

  onDeleteConfirm(): void {
    this.showConfirmDialog = false;
    this.onDeleteUser(this.selectedUserForDelete as User);
  }

  onDeleteCancel(): void {
    this.showConfirmDialog = false;
    this.selectedUserForDelete = null;
  }

  private _updateInLock(users: User[]) {
    this.lockUsers = true;
    this._allUsers$.next(users);
    this._deleteId$.next('');
    this.lockUsers = false;
    return users;
  }
}
