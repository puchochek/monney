import { Injectable } from '@angular/core';

import { FinanceData, LoggedUser } from './interfaces';

@Injectable()
export class DataService {

	countElementHeight(element: string) {
		console.log('---> HH scrollHeight ', document.getElementById('header').scrollHeight);
		console.log('---> HH offsetHeight ', document.getElementById('header').offsetHeight);
		console.log('---> HH clientHeight ', document.getElementById('header').clientHeight);

		console.log('---> window.screen.height ', window.screen.height);
		console.log('---> window.innerHeight ', window.innerHeight);
		const elementHeight = (window.innerHeight - 80);
		console.log('---> elementHeight ', elementHeight);
		document.getElementById(element).style.height = String(elementHeight);
		//console.log('---> HH clientHeight ', document.getElementById('header').clientHeight);
	}

	findIncomeId(currentUser: LoggedUser): string {
		const incomeCategory = [...currentUser.categories].filter(category => category.isIncome)[0];
		return incomeCategory.id;
	}

	sortTransactionsByCategoryId(сategoryId: string, arrayToSort: FinanceData[]) {
		return arrayToSort.filter(expense => expense.category == сategoryId);
	}

	countCategoryTransactionsTotal(transactionsToSort: any, fieldName: string): number {
		const thsiMonthIncomes = transactionsToSort.reduce(function (acc, exp) { return Number(exp[fieldName]) + acc }, 0);
		if (!Number.isInteger(thsiMonthIncomes)) {
			return Number(thsiMonthIncomes.toFixed(2));
		}
		return thsiMonthIncomes;
	}

	getThisMonthTransactions(transactions: FinanceData[]): FinanceData[] {
		const currentMonth = new Date().getMonth();
		return transactions.filter(transaction => new Date(transaction.date).getMonth() == currentMonth);
	}

	setThisMonthExpensesTotal(currentUser: LoggedUser, incomeId: string): number {
		const expenseTransactions = [...currentUser.transactions].filter(transaction => transaction.category !== incomeId);
		const thisMonthExpenseTransactions = this.getThisMonthTransactions(expenseTransactions);
		const thisMonthExpensesTotal = this.countCategoryTransactionsTotal(thisMonthExpenseTransactions, `sum`) || 0;

		return thisMonthExpensesTotal;
	}

	setThisMonthIncomesTotal(currentUser: LoggedUser, incomeId: string): number {
		const incomeTransactions = [...currentUser.transactions].filter(transaction => transaction.category === incomeId);
		const thisMonthIncomeTransactions = this.getThisMonthTransactions(incomeTransactions);
		const thisMonthIncomeTotal = this.countCategoryTransactionsTotal(thisMonthIncomeTransactions, `sum`) || 0;

		return thisMonthIncomeTotal;
	}

	setThisMonthBalanceTotal(incomesTotal: number, expensesTotal: number): number {
		return incomesTotal - expensesTotal;
	}

	getRandomColor() {
        const colorInit = '0123456789ABCDEF'.split('');
        let color = '#';
        for (var i = 0; i < 6; i ++ ) {
            color += colorInit[Math.floor(Math.random() * 16)];
        }
        return color;
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