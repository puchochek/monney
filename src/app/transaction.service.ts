import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FinanceData } from './interfaces';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from './user.service';
import { SpinnerService } from './spinner.service';
import { environment } from './../environments/environment';
import { SnackBarService } from './snack-bar.service';

@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	private readonly transaction = new BehaviorSubject<FinanceData>(null);
	readonly _transaction = this.transaction.asObservable();

	url: string = `${environment.apiBaseUrl}/transaction`;

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private userService: UserService,
		private spinnerService: SpinnerService,
		private snackBarService: SnackBarService
	) { }

	get currentTransaction(): FinanceData {
		return this.transaction.getValue();
	}

	set currentTransaction(transaction: FinanceData) {
		this.transaction.next(transaction);
	}

	createTransaction(transaction: FinanceData, navigateUrl: string) {
		this.spinnerService.isLoading = true;
		this.http.post(this.url, transaction, { observe: 'response' }
		).subscribe(
			response => {
				const newTransaction = <FinanceData>response.body;
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.userService.updateUserTransactions([newTransaction]);
				this.spinnerService.isLoading = false;
				this.snackBarService.snackBarMessage = `Transaction saved.`;
				this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> SAVE EXPENSE ERROR ', error);
				this.spinnerService.isLoading = false;
				this.snackBarService.snackBarMessage = `Oops! ${error.error.message}`;
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	updateTransaction(transaction: FinanceData, navigateUrl: string) {
		this.spinnerService.isLoading = true;
		this.http.patch(this.url, transaction, { observe: 'response' }
		).subscribe(
			response => {
				const updatedTransaction = <FinanceData>response.body;
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.userService.updateUserTransactions([updatedTransaction]);
				this.spinnerService.isLoading = false;
				this.snackBarService.snackBarMessage = `Transaction updated.`;
				this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> UPDATE EXPENSE ERROR ', error);
				this.spinnerService.isLoading = false;
				this.snackBarService.snackBarMessage = `Oops! ${error.error.message}`;
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	deleteTransaction(transaction: FinanceData, navigateUrl: string) {
		this.spinnerService.isLoading = true;
		const requestUrl = `${this.url}/${transaction.id}`;
		this.http.delete(requestUrl, { observe: 'response' }
		).subscribe(
			response => {
				const deletedTransaction = <FinanceData>response.body;
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.userService.updateUserTransactions([deletedTransaction]);
				this.spinnerService.isLoading = false;
				this.snackBarService.snackBarMessage = `Transaction deleted.`;
				this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> DELETE EXPENSE ERROR ', error);
				this.spinnerService.isLoading = false;
				this.snackBarService.snackBarMessage = `Oops! ${error.message}`;
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}
}
