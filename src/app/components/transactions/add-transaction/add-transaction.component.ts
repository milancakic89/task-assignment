import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Transaction } from '../../../shared/interfaces/transctions';
import { amountValidator } from '../../../shared/validators/amount.validator';

@Component({
  selector: 'app-add-transaction',
  imports: [ButtonModule,InputNumberModule, DatePickerModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent {
  private _transaction: Transaction | null = null;
  @Output() transactionSubmitted = new EventEmitter<Transaction>();
  @Output() dialogClosed = new EventEmitter<Transaction>();
  @Input() editMode = false;
  @Input()
  set transaction(value: Transaction){
    if(value){
      this._transaction = value;
      this.form.patchValue({
        ...value,
        timeAndDate: new Date(value.timeAndDate) as any

      });
    }
  }

  showDialog = false;

  fb = inject(FormBuilder);

  form = this.fb.group({
    purchasedItem: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    timeAndDate: new FormControl('', [Validators.required]),
    amountSpent: new FormControl(0, [Validators.required, amountValidator()]),
  });

  onSubmit(): void {
    this.showDialog = false;
    const transaction = {
      ...this._transaction,
      ...this.form.value
    }
    this.transactionSubmitted.emit(transaction as Transaction);
  }

  onCloseDialog(): void {
    this.showDialog = false;
    this.dialogClosed.emit();
  }
}
