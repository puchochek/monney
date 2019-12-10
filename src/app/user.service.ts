import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggedUser, FinanceData, Category } from './interfaces';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly user = new BehaviorSubject<LoggedUser>(null);
	readonly _user = this.user.asObservable();

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router
	) { }

	get appUser(): LoggedUser {
		return this.user.getValue();
	}

	set appUser(user: LoggedUser) {
		this.user.next(user);
	}

	getUser() {
		if (localStorage.getItem("token")) {
			const tokenisedId = this.parseToken(localStorage.getItem("token"));
			const url = `${environment.apiBaseUrl}/user/user-by-token`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.appUser = <LoggedUser>response.body;
						this.dataService.updateToken(response.headers.get('Authorization'));
						console.log('---> USER SERVICE response ', response);
					},
					error => {
						console.log('---> USER SERVICE error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	patchUser(user: LoggedUser[]) {
		const requestUrl = `${environment.apiBaseUrl}/user`;
		this.http.patch(requestUrl, {
			user: user
		}, { observe: 'response' }
		).subscribe(
			response => {
				this.appUser = <LoggedUser>response.body[0];
				this.dataService.updateToken(response.headers.get('Authorization'));
			},
			error => {
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
