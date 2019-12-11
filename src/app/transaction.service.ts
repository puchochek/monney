import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FinanceData } from './interfaces';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from './user.service';
import { SpinnerService } from './spinner.service';

@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	private readonly transaction = new BehaviorSubject<FinanceData>(null);
	readonly _transaction = this.transaction.asObservable();

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private userService: UserService,
		private spinnerService: SpinnerService,
	) { }

	get currentTransaction(): FinanceData {
		return this.transaction.getValue();
	}

	set currentTransaction(transaction: FinanceData) {
		this.transaction.next(transaction);
	}

	doTransactionControllerCall(transaction: FinanceData, requestUrl: string, navigateUrl: string) {
		this.spinnerService.isLoading = true;
		const transactionsToUpsert = [transaction];
		this.http.post(requestUrl, {
			transactionsToUpsert: transactionsToUpsert
		}, { observe: 'response' }
		).subscribe(
			response => {
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.userService.updateUserTransactions(<FinanceData[]>response.body);
				this.spinnerService.isLoading = false;
				this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> SAVE EXPENSE ERROR ', error);
				this.spinnerService.isLoading = false;
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}
}
