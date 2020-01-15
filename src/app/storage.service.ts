import { Injectable } from '@angular/core';
import { ApplicationUser, StorageUser, UserBalance } from './interfaces';


@Injectable({
	providedIn: 'root'
})
export class StorageService {

	constructor() { }

	updateToken(token: string) {
		console.log('---> StorageService token ', token);
		if (token) {
			localStorage.setItem('token', token);
		}
	}

	updateStorageUser(currentUser: ApplicationUser) {
		const storageUser: StorageUser = {
			avatar: currentUser.avatar,
			initials: currentUser.name.substring(0, 2)
		}
		localStorage.setItem('storageUser', JSON.stringify(storageUser));
	}

	updateUserBalance(userIncomes: number, userExpenses: number, userBalance: number) {
		const userBalanceData: UserBalance = {
			incomes: userIncomes,
			expenses: userExpenses,
			balance: userBalance
		}
		localStorage.setItem('userBalance', JSON.stringify(userBalanceData));
	}

	cleanStorage() {
		localStorage.clear();
	}
}
