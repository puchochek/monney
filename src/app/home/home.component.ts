import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { UserService } from '../user.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	@Input() balanceInfoClass: string = `balance-info-title`;

	currentUser: LoggedUser;
	incomeId: string;
	incomesTotal: number;
	expensesTotal: number;
	balanceTotal: number;
	currentDate: Date;
	isLoading: boolean = true;
	incomeMenuItems: [
		{ name: `Add income`, routerLink:  `/transaction/new/Income` },
		{ name: `View incomes`, routerLink: `/detail/{{Income}}` }
	];

	constructor(
		private dataService: DataService,
		private router: Router,
		private http: HttpClient,
		private userService: UserService,
	) { }

	ngOnInit() {
		this.currentDate = new Date();
		const token = localStorage.getItem("token");
		if (token) {
			const tokenisedId = localStorage.getItem("token").split(" ")[1];
			const url = `${environment.apiBaseUrl}/user/user-by-token/${tokenisedId}`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						this.userService.appUser = { ...this.currentUser };
						console.log('---> HOME response ', response);
						this.setIncomeId();
						this.setBalanceInfo();
						this.dataService.updateToken(response.headers.get('Authorization'));
						this.isLoading = false;
					},
					error => {
						console.log('---> HOME error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	setIncomeId() {
		if (this.currentUser.categories && this.currentUser.categories.length !== 0) {
			this.incomeId = this.dataService.findIncomeId(this.currentUser);
		} else {
			const userId = localStorage.getItem("userId");
			this.createIncomeCategoryForNewUser(userId);
		}
	}

	setBalanceInfo() {
		this.expensesTotal = this.dataService.setThisMonthExpensesTotal(this.currentUser, this.incomeId);
		this.incomesTotal = this.dataService.setThisMonthIncomesTotal(this.currentUser, this.incomeId);
		this.balanceTotal = this.dataService.setThisMonthBalanceTotal(this.incomesTotal, this.expensesTotal);
		if (this.balanceTotal < this.currentUser.balanceEdge) {
			this.balanceInfoClass = `low-balance-info-title`;
		}
	}

	setThisMonthExpensesTotal(): number {
		const expenseTransactions = [...this.currentUser.transactions].filter(transaction => transaction.category !== this.incomeId);
		const thisMonthExpenseTransactions = this.dataService.getThisMonthTransactions(expenseTransactions);
		const thisMonthExpensesTotal = this.dataService.countCategoryTransactionsTotal(thisMonthExpenseTransactions, `sum`) || 0;

		return thisMonthExpensesTotal;
	}

	setThisMonthIncomesTotal(): number {
		const incomeTransactions = [...this.currentUser.transactions].filter(transaction => transaction.category === this.incomeId);
		const thisMonthIncomeTransactions = this.dataService.getThisMonthTransactions(incomeTransactions);
		const thisMonthIncomeTotal = this.dataService.countCategoryTransactionsTotal(thisMonthIncomeTransactions, `sum`) || 0;

		return thisMonthIncomeTotal;
	}

	setThisMonthBalanceTotal() {
		return this.incomesTotal - this.expensesTotal;
	}

	createIncomeCategoryForNewUser(userId: string) {
		const requestUrl = `${environment.apiBaseUrl}/category/upsert`;
		const categoriesToUpsert = [{
			name: `Income`,
			description: `Keeps your incomes data.`,
			user: userId,
			isActive: true,
			isIncome: true
		}];
		this.http.post(requestUrl, {
			categoriesToUpsert: categoriesToUpsert
		}, { observe: 'response' }
		).subscribe(
			response => {
				const incomeCategory = <Category>response.body[0];
				this.incomeId = incomeCategory.id;
			},
			error => {
				console.log('---> createIncomeCategoryForNewUser ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

}
