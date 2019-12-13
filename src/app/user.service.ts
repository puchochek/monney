import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggedUser, FinanceData, Category } from './interfaces';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SpinnerService } from './spinner.service';
import { SnackBarService } from './snack-bar.service';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly user = new BehaviorSubject<LoggedUser>(null);
	readonly _user = this.user.asObservable();

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private spinnerService: SpinnerService,
		private snackBarService: SnackBarService
	) { }

	get appUser(): LoggedUser {
		return this.user.getValue();
	}

	set appUser(user: LoggedUser) {
		this.user.next(user);
	}

	activateUser(token: string) {
		this.http.post(`${environment.apiBaseUrl}/user/activate`, {
			token: token,
		}).subscribe((response: LoggedUser) => {
			console.log('---> activateUser result ', response);
			if (response) {
				this.appUser = response[0];
				this.dataService.updateToken(token);
				this.dataService.updateUserId(response.id);
				this.router.navigate(['/home']);
			} else {
				// TODO add error modal
			}
		});
	}

	getUser() {
		if (localStorage.getItem("token")) {
			this.spinnerService.isLoading = true;
			const url = `${environment.apiBaseUrl}/user/token`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.appUser = <LoggedUser>response.body;
						this.dataService.updateToken(response.headers.get('Authorization'));
						console.log('---> USER SERVICE response ', response);
						this.spinnerService.isLoading = false;
					},
					error => {
						console.log('---> USER SERVICE error ', error);
						this.spinnerService.isLoading = false;
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	getUserFromDB(): Observable<any> {
		if (localStorage.getItem("token")) {
			const url = `${environment.apiBaseUrl}/user/token`;
			return this.http.get(url)
		} else {
			this.router.navigate(['/hello-monney']);
		}
	}

	patchUser(user: LoggedUser[]) {
		this.spinnerService.isLoading = true;
		const requestUrl = `${environment.apiBaseUrl}/user`;
		this.http.patch(requestUrl, user, { observe: 'response' }
		).subscribe(
			response => {
				this.appUser = <LoggedUser>response.body[0];
				console.log('---> UPSERT USER ', <LoggedUser>response.body);
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.spinnerService.isLoading = false;
				this.snackBarService.snackBarMessage = `User info updated.`
			},
			error => {
				this.spinnerService.isLoading = false;
				this.snackBarService.snackBarMessage = `Something was wrong. Try again.`;
				console.log('---> UPSERT USER ERROR ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	parseToken(token: string): string {
		if (token.includes(`Bearer`)) {
			return token.split(" ")[1];
		} else {
			return token;
		}
	}

	updateUserTransactions(updatedTransactions: FinanceData[]) {
		const currentUser = { ...this.appUser };
		const transactionsList = [...currentUser.transactions];
		updatedTransactions.forEach(transactionToUpdate => {
			const updatedTransactionIndex = transactionsList.findIndex(transaction => transaction.id === transactionToUpdate.id);
			if (updatedTransactionIndex >= 0) {
				transactionsList[updatedTransactionIndex] = transactionToUpdate
			} else {
				transactionsList.push(transactionToUpdate);
			}
		});
		currentUser.transactions = transactionsList;
		this.appUser = currentUser;
	}

	updateUserCategories(updatedCategories: Category[]) {
		const currentUser = { ...this.appUser };
		const categoriesList = [...currentUser.categories];
		updatedCategories.forEach(categoryToUpdate => {
			const updatedTransactionIndex = categoriesList.findIndex(transaction => transaction.id === categoryToUpdate.id);
			if (updatedTransactionIndex >= 0) {
				categoriesList[updatedTransactionIndex] = categoryToUpdate
			} else {
				categoriesList.push(categoryToUpdate);
			}
		});
		currentUser.categories = categoriesList;
		this.appUser = currentUser;
	}
}
