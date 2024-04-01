import { DatePipe } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AddTransactionComponent } from "./add-transaction.component";
import TransactionsComponent from "./transactions.component";

describe('TransactionsComponent', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TransactionsComponent],
      }).compileComponents();
    });

    it('should create the component', () => {
        const fixture = TestBed.createComponent(TransactionsComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should have a current balance', () => {
        const fixture = TestBed.createComponent(TransactionsComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component.currentBalance).toBeDefined();
        const currentBalanceElement = fixture.debugElement.nativeElement.querySelector('h3');
        expect(currentBalanceElement).toBeTruthy();
        expect(currentBalanceElement.textContent).toContain(`Current Balance: $ ${component.currentBalance()}`);
    });

    it('should open a dialog to add a transaction', () => {
        const fixture = TestBed.createComponent(TransactionsComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const dialogOpenBtn = buttons[0];
        dialogOpenBtn.triggerEventHandler('click');
        fixture.detectChanges();
        expect(component.addTransactionDialogOpen()).toBeTrue();
        const addTransactionDialog = fixture.debugElement.query(By.directive(AddTransactionComponent));
        expect(addTransactionDialog).toBeTruthy();
        expect(addTransactionDialog.componentInstance.open()).toBeTrue();
    });

    it('should add a transaction', () => {
        const fixture = TestBed.createComponent(TransactionsComponent);
        const component = fixture.componentInstance;
        const addTransactionSpy = spyOn(component, 'addTransaction').and.callThrough();
        fixture.detectChanges();
        const addTransactionDialog = fixture.debugElement.query(
          By.directive(AddTransactionComponent)
        );
        const transaction = { title: 'Test', amount: 100 };
        addTransactionDialog.triggerEventHandler('transactionAdded', transaction);
        expect(addTransactionSpy).toHaveBeenCalledWith(transaction);
        expect(component.transactions().length).toBe(5);
        console.log(component.transactions().at(-1));
        expect(component.transactions().at(-1)?.title).toBe(transaction.title);
        expect(component.transactions().at(-1)?.amount).toBe(transaction.amount);
    });

    it('should render a table with transactions', () => {
        const fixture = TestBed.createComponent(TransactionsComponent);
        const component = fixture.componentInstance;
        const datePipe = new DatePipe('en-US');
        fixture.detectChanges();
        const table = fixture.debugElement.query(By.css('table'));
        expect(table.nativeElement).toBeTruthy();
        const transactions = component.transactions();
        const rows = table.queryAll(By.css('tr'));
        expect(rows.length).toBe(transactions.length + 1);
        rows.forEach((row, index) => {
            if (index > 0) {
                const transaction = transactions.at(index - 1);
                expect(row.nativeElement).toBeTruthy();
                const cells = row.queryAll(By.css('td'));
                expect(cells.length).toBe(4);
                expect(cells.at(0)!.nativeElement.textContent).toContain(transaction?.title);
                expect(cells.at(1)!.nativeElement.textContent).toContain(transaction?.amount);
                expect(cells.at(2)!.nativeElement.textContent).toContain(datePipe.transform(transaction?.date));
                const deleteBtn = cells.at(3)!.query(By.css('button'));
                expect(deleteBtn).toBeTruthy();
            }
        });
    });

    it('should delete a transaction', () => {
        const fixture = TestBed.createComponent(TransactionsComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();
        const deleteSpy = spyOn(component, 'deleteTransaction').and.callThrough();
        const table = fixture.debugElement.query(By.css('table'));
        const rows = table.queryAll(By.css('tr'));
        const deleteBtn = rows[1].query(By.css('button'));
        deleteBtn.triggerEventHandler('click');
        expect(deleteSpy).toHaveBeenCalled();
        expect(component.transactions().length).toBe(3);
    });
});