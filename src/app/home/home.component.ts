import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
// import { MatCardModule, MatButtonModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoggedUser, FinanceData } from '../interfaces';
// import { Category } from '../interfaces';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';
import { TransactionService } from '../transaction.service';

import { BalanceService } from '../balance.service';


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
		private balanceService: BalanceService,
		private transactionService: TransactionService,
	) { }

	ngOnInit() {
		this.currentDate = new Date();
		this.subscription = this.userService._user.subscribe((response) => {
			console.log('---> HOME _user ', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.setIncomeId();
				this.setBalanceInfo();
				//this.checkLastBalanceResetDate();
				this.checkLastBalanceReset();
				
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

	checkLastBalanceReset() {
		const currentMonth = new Date().getMonth() + 1;
		const lastBalanceResetMonth = { ...this.currentUser }.lastBalanceReset;
		if (lastBalanceResetMonth < currentMonth) {
			const navigateUrl = `/home`;
			const userId = this.currentUser.id;
			const transactionToSave: FinanceData = {
				comment: `Last month surplus.`,
				sum: this.balanceService.countLastMonthBalance(this.currentUser, this.incomeId),
				category: `Income`,
				userId: userId,
				date: new Date().toISOString()
			};

			this.transactionService.createTransaction(transactionToSave, navigateUrl);
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
		this.expensesTotal = this.countThisMonthExpensesSum();
		this.incomesTotal = this.countThisMonthIncomesSum();
		this.balanceTotal = this.countThisMonthBalanceSum();
		if (this.balanceTotal < this.currentUser.balanceEdge) {
			this.balanceInfoClass = `low-balance-info-title`;
		}
	}

	countThisMonthExpensesSum(): number {
		const expenseTransactions = [...this.currentUser.transactions].filter(transaction => transaction.category !== this.incomeId);
		const thisMonthExpenseTransactions = this.dataService.getThisMonthTransactions(expenseTransactions);
		const thisMonthExpensesTotal = this.balanceService.countCategoryTransactionsSum(thisMonthExpenseTransactions, `sum`) || 0;

		return thisMonthExpensesTotal;
	}

	countThisMonthIncomesSum(): number {
		const incomeTransactions = [...this.currentUser.transactions].filter(transaction => transaction.category === this.incomeId);
		const thisMonthIncomeTransactions = this.dataService.getThisMonthTransactions(incomeTransactions);
		const thisMonthIncomeTotal = this.balanceService.countCategoryTransactionsSum(thisMonthIncomeTransactions, `sum`) || 0;

		return thisMonthIncomeTotal;
	}

	countThisMonthBalanceSum() {
		return this.incomesTotal - this.expensesTotal;
	}
}
