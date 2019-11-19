import { Injectable } from '@angular/core';

import { FinanceData } from './interfaces';

@Injectable()
export class DataService {

	sortTransactions(incomeCategoryId: string, arrayToSort: FinanceData[]): {} {
		const thisMonthTransactionByType = arrayToSort.reduce((exps, exp) => {
			if (exp.category === incomeCategoryId) {
				exps['incomes'].push(exp);
			} else {
				exps['expenses'].push(exp);
			}
			return exps;
		}, { incomes: [], expenses: [] });
		return thisMonthTransactionByType;
	}

	sortTransactionsByCategoryId(сategoryId: string, arrayToSort: FinanceData[]) {
		return arrayToSort.filter(expense => expense.category == сategoryId);
	}

	countBalance(transactionsToSort: any): number {
		const thsiMonthExpenses = transactionsToSort[`expenses`].reduce(function (acc, exp) { return Number(exp.sum) + acc }, 0);
		const thsiMonthIncomes = transactionsToSort[`incomes`].reduce(function (acc, exp) { return Number(exp.sum) + acc }, 0);
		return thsiMonthIncomes - thsiMonthExpenses;
	}

	countCategoryTransactionsTotal(transactionsToSort: any): number {
		const thsiMonthIncomes = transactionsToSort.reduce(function (acc, exp) { return Number(exp.sum) + acc }, 0);
		return thsiMonthIncomes;
	}

	getThisMonthTransactions(transactions: FinanceData[]): FinanceData[] {
		const currentMonth = new Date().getMonth();
		return transactions.filter(transaction => new Date(transaction.date).getMonth() == currentMonth);

	}

	orderTransactionsByDate(incomes: FinanceData[]): FinanceData[] {
		const sortedIncomes = incomes.sort(function (a, b) {
			return (new Date(b.date) as any) - (new Date(a.date) as any);
		});
		return sortedIncomes;
	}

	updateToken(newToken: string) {
		localStorage.setItem('token', newToken);
	}

	updateUserId(userId: string) {
		localStorage.setItem('userId', userId);
	}

	cleanLocalstorage() {
		localStorage.clear();
	}

}