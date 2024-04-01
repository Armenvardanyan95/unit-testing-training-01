import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AddTransactionComponent } from "./add-transaction.component";

describe('AddTransactionComponent', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AddTransactionComponent],
      }).compileComponents();
    });

    it('should create the component', () => {
        const fixture = TestBed.createComponent(AddTransactionComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should open a dialog', () => {
        const fixture = TestBed.createComponent(AddTransactionComponent);
        const component = fixture.componentInstance;
        component.open.set(true);
        fixture.detectChanges();
        const dialog = fixture.debugElement.nativeElement.querySelector('dialog') as HTMLDialogElement;
        expect(dialog).toBeTruthy();
        expect(dialog.open).toBe(true);
    });

    it('should cancel the dialog', () => {
        const fixture = TestBed.createComponent(AddTransactionComponent);
        const component = fixture.componentInstance;
        const cancelBtn = fixture.debugElement.query(By.css('.danger'));
        cancelBtn.triggerEventHandler('click');
        fixture.detectChanges();
        expect(component.open()).toBe(false);
        expect(component.form.value.amount).toBe(0);
        expect(component.form.value.title).toBe('');
        expect(component.type()).toBe('expense');
    });

    it('should add a transaction', () => {
        const fixture = TestBed.createComponent(AddTransactionComponent);
        const component = fixture.componentInstance;
        const addTransactionSpy = spyOn(component.transactionAdded, 'emit');
        expect(component.form.valid).toBe(false);
        component.form.setValue({ title: 'Test', amount: 100 });
        component.type.set('income');
        fixture.detectChanges();
        const addTransactionBtn = fixture.debugElement.queryAll(By.css('button')).at(1)!;
        expect(addTransactionBtn).toBeTruthy();
        addTransactionBtn.triggerEventHandler('click');
        fixture.detectChanges();
        expect(addTransactionSpy).toHaveBeenCalledWith({ title: 'Test', amount: 100});
        component.cancel();
        fixture.detectChanges();
        component.form.setValue({ title: 'Test', amount: 100 });
        component.type.set('expense');
        addTransactionBtn.triggerEventHandler('click');
        fixture.detectChanges();
        expect(addTransactionSpy).toHaveBeenCalledWith({ title: 'Test', amount: -100});
    });
});