import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction, ApplicationUser } from './interfaces';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../app/user.service';
import { environment } from './../environments/environment';
import { transition } from '@angular/animations';

@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	// private readonly transactions = new BehaviorSubject<Transaction[]>(null);
	// readonly _transactions = this.transactions.asObservable();


	url: string = `${environment.apiBaseUrl}/transaction`;

	constructor(
		private http: HttpClient,
		private router: Router,
		private userService: UserService,
	) { }

	// get userTransactions(): Transaction[] {
	// 	return this.transactions.getValue();
	// }

	// set userTransactions(transactions: Transaction[]) {
	// 	this.transactions.next(transactions);
	// }

	createTransaction(transaction: Transaction, navigateUrl: string) {
		this.http.post(this.url, transaction, { observe: 'response' }
		).subscribe(
			response => {
				const newTransaction = <Transaction>response.body;
				console.log('---> newTransaction ', newTransaction);
				this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> SAVE TRANSACTION ERROR ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	deleteTransaction(user: ApplicationUser, transaction: Transaction) {
		this.http.patch(this.url, transaction, { observe: 'response' }
		).subscribe(
			response => {
				const deletedTransaction = <Transaction>response.body;
				console.log('---> deleted Transaction ', deletedTransaction);
				this.userService.updateUserTransactions(deletedTransaction, user);
			},
			error => {
				console.log('---> DELETE TRANSACTION ERROR ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	updateTransaction(transaction: Transaction, navigateUrl: string) {
		this.http.patch(this.url, transaction, { observe: 'response' }
		).subscribe(
			response => {
				const updatedTransaction = <Transaction>response.body;
				console.log('---> update Transaction ', updatedTransaction);
				this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> DELETE TRANSACTION ERROR ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	getTransactionsByCategoryId(user: ApplicationUser, categoryId: string): Transaction[] {
		let userTransactions: Transaction[];
		if (user.transactions.length) {
			userTransactions = [...user.transactions];
		}

		return userTransactions.filter(transaction => transaction.category === categoryId && !transaction.isDeleted);
	}

	getTransactionById(transactions: Transaction[], transactionId: string): Transaction {
		let transactionById: Transaction;
		const transactionsById = transactions.filter(transaction => transaction.id === transactionId);
		if (transactionsById.length) {
			transactionById = transactionsById[0];
		}

		return transactionById;
	}

	getTransactionsByDates(startDate: Date, endDate: Date, transactions: Transaction[]): Transaction[] {
		return transactions.filter(transaction => {
			const startDateFormatted = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
			const endDateFormatted = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
			const transactionDateFormatted = new Date(Date.UTC(new Date(transaction.date).getFullYear(), new Date(transaction.date).getMonth(), new Date(transaction.date).getDate()));

			return transactionDateFormatted >= startDateFormatted && transactionDateFormatted <= endDateFormatted;
		});
	}
}
