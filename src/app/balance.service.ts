import { Injectable } from '@angular/core';
import { ApplicationUser, Category, Transaction } from './interfaces';

@Injectable({
	providedIn: 'root'
})
export class BalanceService {

	constructor() { }

	getThisMonthTransactionsByCategoryId(categoryId: string, transactions: Transaction[]): Transaction[] {
		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();
		return transactions.filter(
			transaction =>
				transaction.category === categoryId
				&& new Date(transaction.date).getMonth() === currentMonth
				&& new Date(transaction.date).getFullYear() === currentYear
		);
	}

	countTransactionsSum(transactions: Transaction[]): number {
		return transactions.reduce((sum, transaction) => {
			sum = sum + transaction.sum;
			return sum;
		}, 0);
	}
}
