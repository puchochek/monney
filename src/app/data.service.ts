import { Injectable } from '@angular/core';
import { FinanceData, LoggedUser } from './interfaces';

@Injectable()
export class DataService {

	findIncomeId(currentUser: LoggedUser): string {
		const incomeCategory = [...currentUser.categories].filter(category => category.isIncome)[0];
		return incomeCategory.id;
	}

	sortTransactionsByCategoryId(сategoryId: string, arrayToSort: FinanceData[]) {
		return arrayToSort.filter(expense => expense.category == сategoryId);
	}

	getThisMonthTransactions(transactions: FinanceData[]): FinanceData[] {
		const currentMonth = new Date().getMonth();
		return transactions.filter(transaction => new Date(transaction.date).getMonth() == currentMonth);
	}

	getLastMonthTransactions(transactions: FinanceData[]): FinanceData[] {
		const currentMonth = new Date().getMonth() - 1;
		return transactions.filter(transaction => new Date(transaction.date).getMonth() == currentMonth);
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

	cleanLocalstorage() {
		localStorage.clear();
	}

}