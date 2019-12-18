import { Injectable, OnInit } from '@angular/core';
import { LoggedUser } from './interfaces';
import { DataService } from './data.service';

@Injectable({
	providedIn: 'root'
})
export class BalanceService {

	constructor(
		private dataService: DataService,
	) { }

	countCategoryTransactionsSum(transactionsToSort: any, fieldName: string): number {
		const thsiMonthIncomes = transactionsToSort.reduce(function (acc, exp) { return Number(exp[fieldName]) + acc }, 0);
		if (!Number.isInteger(thsiMonthIncomes)) {
			return Number(thsiMonthIncomes.toFixed(2));
		}
		return thsiMonthIncomes;
	}

	countThisMonthExpensesSum(currentUser: LoggedUser, incomeId: string): number {
		const expenseTransactions = [...currentUser.transactions].filter(transaction => transaction.category !== incomeId);
		const thisMonthExpenseTransactions = this.dataService.getThisMonthTransactions(expenseTransactions);
		const thisMonthExpensesTotal = this.countCategoryTransactionsSum(thisMonthExpenseTransactions, `sum`) || 0;

		return thisMonthExpensesTotal;
	}

	countThisMonthIncomesSum(currentUser: LoggedUser, incomeId: string): number {
		const incomeTransactions = [...currentUser.transactions].filter(transaction => transaction.category === incomeId);
		const thisMonthIncomeTransactions = this.dataService.getThisMonthTransactions(incomeTransactions);
		const thisMonthIncomeTotal = this.countCategoryTransactionsSum(thisMonthIncomeTransactions, `sum`) || 0;

		return thisMonthIncomeTotal;
	}

	countThisMonthBalanceSum(incomesTotal: number, expensesTotal: number): number {
		return incomesTotal - expensesTotal;
	}

	countLastMonthBalance(currentUser: LoggedUser, incomeId: string): number {
		const incomeTransactions = [...currentUser.transactions].filter(transaction => transaction.category === incomeId);
		const lastMonthIncomeTransactions = this.dataService.getLastMonthTransactions(incomeTransactions);
		const lastMonthIncomeTotal = this.countCategoryTransactionsSum(lastMonthIncomeTransactions, `sum`) || 0;
		const expenseTransactions = [...currentUser.transactions].filter(transaction => transaction.category !== incomeId);
		const lastMonthExpensesTransactions = this.dataService.getLastMonthTransactions(expenseTransactions);
		const lastMonthExpensesTotal = this.countCategoryTransactionsSum(lastMonthExpensesTransactions, `sum`) || 0;
		return lastMonthIncomeTotal - lastMonthExpensesTotal;
	}
}
