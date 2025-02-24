import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Transaction, TransactionChange } from '../../../shared/interfaces/transctions';
import { amountValidator } from '../../../shared/validators/amount.validator';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [ButtonModule,InputNumberModule, DatePickerModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTransactionComponent {
  fb = inject(FormBuilder);

  private _transaction: Transaction | null = null;

  @Output() transactionSubmitted = new EventEmitter<TransactionChange>();
  @Output() dialogClosed = new EventEmitter();

  @Input()
  set transaction(value: Transaction){
    if(value){
      this.form.patchValue({
        ...value,
        timeAndDate: new Date(value.timeAndDate)
      });
      this._transaction = value;
    }
  }

  showDialog = false;

  form = this.fb.group({
    purchasedItem: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    timeAndDate: new FormControl(new Date(), [Validators.required]),
    amountSpent: new FormControl(1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/), amountValidator()]),
  });

  onSubmit(): void {
    this.showDialog = false;
    const transaction = {
      ...this._transaction,
      ...this.form.value
    }
    const previousTransactionAmount = this._transaction?.amountSpent || 0;
    this.transactionSubmitted.emit({
      transaction,
      previousAmount: previousTransactionAmount
    } as TransactionChange);
    this.form.reset();
  }

  onCloseDialog(): void {
    this.showDialog = false;
    this.dialogClosed.emit();
  }
}
