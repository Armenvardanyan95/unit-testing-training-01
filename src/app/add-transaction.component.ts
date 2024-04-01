import { Component, inject, model, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type Full<T> = {
  [P in keyof T]-?: T[P];
};

@Component({
  selector: 'app-add-transaction',
  template: `
    <dialog [open]="open()">
      <form [formGroup]="form">
        <div class="field">
          <label for="expense">Expense</label>
          <div>
            <input
              type="radio"
              id="expense"
              name="transactionType"
              value="expense"
              checked
              (click)="type.set('expense')"
            />
            <input
              type="radio"
              id="income"
              name="transactionType"
              value="income"
              (click)="type.set('income')"
            />
          </div>
          <label for="income">Income</label>
        </div>
        <div class="field">
          <label for="title">Title</label>
          <input id="title" formControlName="title" />
        </div>
        <div class="field">
          <label for="amount">Amount</label>
          <input id="amount" type="number" formControlName="amount" />
        </div>
        <footer>
          <button class="danger" (click)="cancel()">Cancel</button>
          <button (click)="addTransaction()">Add Transaction</button>
        </footer>
      </form>
    </dialog>
  `,
  styles: `
    form {
        padding: 10px;

        .field {
            display: flex;
            margin-bottom: 15px;
            justify-content: space-between;
            align-items: center;
        }
    }

    footer {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }
  `,
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class AddTransactionComponent {
  open = model(false);
  transactionAdded = output<Full<typeof this.form.value>>();
  formBuilder = inject(FormBuilder);
  type = signal('expense');
  form = this.formBuilder.nonNullable.group({
    title: this.formBuilder.nonNullable.control('', {validators: Validators.required}),
    amount: this.formBuilder.nonNullable.control<number>(0, {validators: Validators.required}),
  });

  addTransaction() {
    if (this.form.valid) {
      const amount = this.form.controls.amount;
      this.form.controls.amount.setValue(
        this.type() === 'expense' ? -amount.value : amount.value
      );
      this.transactionAdded.emit(
        this.form.value as Full<typeof this.form.value>
      );
      this.form.reset();
    }
  }

  cancel() {
    this.open.set(false);
    this.form.reset();
    this.type.set('expense');
  }
} 