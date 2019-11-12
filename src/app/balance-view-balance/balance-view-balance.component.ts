import { Component, OnInit, Input } from '@angular/core';
import { LoggedUser } from '../interfaces';
import { FinanceData } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { Router, NavigationExtras, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	selector: 'app-balance-view-balance',
	templateUrl: './balance-view-balance.component.html',
	styleUrls: ['./balance-view-balance.component.scss']
})
export class BalanceViewBalanceComponent implements OnInit {
	@Input() appUser: LoggedUser;
	balanceLabel: string;
	currentBalanceValue: number;
	currentIncomesValue: number;
	currentExpensesValue: number;
	currentDate: Date;
	incomesLabel: string;
	expensesLabel: string;

	constructor(
		private dataService: DataService,
	) { }

	ngOnInit() {
		this.currentDate = new Date();
		this.balanceLabel = `balance:`;
		this.incomesLabel = `incomes:`;
		this.expensesLabel = `expenses:`;
		const categories = this.appUser.categories;
		const thisMonthTransaction = this.appUser.transactions.filter(expense => new Date(expense.date).getMonth() === this.currentDate.getMonth());
		const incomeCategory = categories.filter(category => category.name === 'income');
		const thisMonthTransactionByType = this.dataService.sortTransactions(incomeCategory[0].id, thisMonthTransaction);

		this.currentBalanceValue = this.dataService.countBalance(thisMonthTransactionByType);
		this.currentIncomesValue = this.dataService.countCategoryTransactionsTotal(thisMonthTransactionByType[`incomes`]);
		this.currentExpensesValue = this.dataService.countCategoryTransactionsTotal(thisMonthTransactionByType[`expenses`]);
	}

}
