import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';

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
	incomeMenuItems: [
		{ name: `Add income`, routerLink: `/transaction/new/Income` },
		{ name: `View incomes`, routerLink: `/detail/{{Income}}` }
	];
	private subscription: Subscription;

	constructor(
		private dataService: DataService,
		private router: Router,
		private http: HttpClient,
		private userService: UserService,
		private categoryService: CategoryService,
	) { }

	ngOnInit() {
		this.currentDate = new Date();
		this.subscription = this.userService._user.subscribe((response) => {
			console.log('---> HOME _user ', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.setIncomeId();
				this.setBalanceInfo();
			} else {
				this.router.navigate([`/hello-monney`]);
			}
		});
	}
	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	setIncomeId() {
		if (this.currentUser.categories && this.currentUser.categories.length !== 0) {
			this.incomeId = this.dataService.findIncomeId(this.currentUser);
		} else {
			this.categoryService.checkIncomeCategory();
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
}
