import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { FinanceData } from './interfaces';

@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	private readonly transaction = new BehaviorSubject<FinanceData>(null);
	readonly _transaction = this.transaction.asObservable();

	constructor() { }

	get currentTransaction(): FinanceData {
		return this.transaction.getValue();
	}

	set currentTransaction(transaction: FinanceData) {
		this.transaction.next(transaction);
	}
}
