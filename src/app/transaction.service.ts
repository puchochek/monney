import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from './interfaces';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TransactionService {

	url: string = `${environment.apiBaseUrl}/transaction`;

	constructor(
		private http: HttpClient,
		private router: Router,
	) { }

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

	getTransactionsByCategorty(category: string): Transaction[] {
		console.log('---> category ', category);
		let transactions: Transaction[];
		const requestUrl = `${this.url}/${category}`;
		this.http.get(requestUrl, { observe: 'response' }
		).subscribe(
			response => {
				transactions = <Transaction[]>response.body;
				console.log('---> newTransaction ', transactions);

				//this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> SAVE TRANSACTION ERROR ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
		return transactions;
	}
}
