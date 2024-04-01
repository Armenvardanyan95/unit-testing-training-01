import { DatePipe } from '@angular/common';
import { Component, WritableSignal, computed, signal } from '@angular/core';
import { AddTransactionComponent } from './add-transaction.component';
import { Transaction } from './types/transaction.type';

@Component({
  selector: 'app-transactions',
  template: `
    <div class="container">
      <header>
        <h2>Transactions</h2>
        <h3>Current Balance: $ {{ currentBalance() }}</h3>
        <button (click)="openAddTransactionDialog()">Add Transaction</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (transaction of transactions(); track transaction.id) {
          <tr [class.negative]="transaction.amount < 0">
            <td>{{ transaction.title }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ transaction.date | date }}</td>
            <td class="actions">
              <button
                class="danger"
                (click)="deleteTransaction(transaction.id)"
              >
                Delete
              </button>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>
    <app-add-transaction
      [(open)]="addTransactionDialogOpen"
      (transactionAdded)="addTransaction($event)"
    />
  `,
  styles: `
    $primary-color: #008B8B;
    $secondary-color: #FF00FF;
    $border-color: #ddd;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    table {
        width: 80%;
        border-collapse: collapse;
        border: 1px solid $border-color;
        font-family: Arial, sans-serif;
        color: white;
    }

    th {
        background-color: $primary-color;
        color: white;
        padding: 10px;
        text-align: left;
    }

    tr {
        td {
          background-color: green;

          &.actions {
            background-color: white !important;
          }
        }

        &.negative {
            td {
              background-color: #FF420E;
            }
        }
    }

    td {
        padding: 10px;
        border-bottom: 1px solid $border-color;
    }

    tr:hover {
        background-color: lighten($primary-color, 10%);
    }
  `,
  standalone: true,
  imports: [DatePipe, AddTransactionComponent],
})
export default class TransactionsComponent {
  transactions: WritableSignal<Transaction[]> = signal([
    {
      id: 1,
      title: 'Groceries',
      amount: -100,
      date: new Date('2024-01-01'),
    },
    {
      id: 2,
      title: 'Gas',
      amount: -30,
      date: new Date('2024-01-02'),
    },
    {
      id: 3,
      title: 'Dinner',
      amount: -50,
      date: new Date('2024-01-03'),
    },
    {
      id: 4,
      title: 'Salary',
      amount: 5_000,
      date: new Date('2024-01-01'),
    },
  ]);

  currentBalance = computed(() => {
    return this.transactions().reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);
  });

  addTransactionDialogOpen = signal(false);

  openAddTransactionDialog() {
    this.addTransactionDialogOpen.set(true);
  }

  addTransaction(rawData: Pick<Transaction, 'amount' | 'title'>) {
    const transaction: Transaction = {
      id: this.transactions().length + 1,
      amount: rawData.amount,
      title: rawData.title,
      date: new Date(),
    };

    this.transactions.set([...this.transactions(), transaction]);
    this.addTransactionDialogOpen.set(false);
  }

  deleteTransaction(id: number) {
    this.transactions.set(
      this.transactions().filter((transaction) => transaction.id !== id)
    );
  }
}