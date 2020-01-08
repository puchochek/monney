import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction, ApplicationUser } from './interfaces';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';

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

	getTransactionsByCategoryId(user: ApplicationUser, categoryId: string): Transaction[] {
		let userTransactions: Transaction[];
		if (user.transactions.length) {
			userTransactions = [ ...user.transactions ];
		}
		return userTransactions.filter(transaction => transaction.category === categoryId);
	}

	// getTransactionsByCategorty(category: string) {
	// 	const requestUrl = `${this.url}/${category}`;
	// 	this.http.get(requestUrl, { observe: 'response' }
	// 	).subscribe(
	// 		response => {
	// 			this.userTransactions = <Transaction[]>response.body;
	// 		},
	// 		error => {
	// 			console.log('---> GET TRANSACTIONS ERROR ', error);
	// 		},
	// 		() => {
	// 			// 'onCompleted' callback.
	// 			// No errors, route to new page here
	// 		}
	// 	);
	// }
}
