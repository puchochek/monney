import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { BalanceService } from '../balance.service';
import { StorageService } from '../storage.service';
import { ApplicationUser, Transaction, Category } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-balance',
	templateUrl: './balance.component.html',
	styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

	currentDate: Date;
	monthStartDate: Date;
	currentUser: ApplicationUser;
	incomesInfoValue: number;
	expensesInfoValue: number;
	balanceInfoValue: number;
	balanceValue: string;
	lowBalanceMessage: string;
	balanceDatesCommentMessage: string = `*Only this month data is available here. If You wish to look through the earlier balance dynamic - check the `;
	reportsLink: string = `reports page.`;
	incomesInfoLbl: string = `incomes:`;
	expensesLbl: string = `expenses:`;
	balanceLbl: string = `balance:`;

	private userSubscription: Subscription;

	constructor(
		private userService: UserService,
		private balanceService: BalanceService,
		private storageService: StorageService,
	) { }

	ngOnInit() {
		this.currentDate = new Date();
		this.monthStartDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);

		this.userSubscription = this.userService._user.subscribe(response => {
			if (response) {
				this.currentUser = <ApplicationUser>response;
				console.log('---> user balance USER ', this.currentUser);
				this.setBalanceInfo();
			}
		});
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	setBalanceInfo() {
		const incomeId: string = this.balanceService.getCategoryIdByName('Income', this.currentUser.categories);
		const thisMonthIncomes: Transaction[] = this.balanceService.getThisMonthTransactionsByCategoryId(incomeId, this.currentUser.transactions);
		this.incomesInfoValue = thisMonthIncomes.length ? this.balanceService.countTransactionsSum(thisMonthIncomes) : 0;

		const expensesCategories: Category[] = this.currentUser.categories.filter(category => category.id !== incomeId);
		let thisMonthExpensesTotal: number;
		if (expensesCategories.length) {
			thisMonthExpensesTotal = expensesCategories.reduce((sum, category) => {
				const thisMonthCategoryTransactions: Transaction[] = this.balanceService.getThisMonthTransactionsByCategoryId(category.id, this.currentUser.transactions);
				if (thisMonthCategoryTransactions.length) {
					const thisMonthCategoryTransactionsSum: number = this.balanceService.countTransactionsSum(thisMonthCategoryTransactions);
					sum = sum + thisMonthCategoryTransactionsSum;
				} else {
					sum = sum;
				}
				return sum;
			}, 0);
		}
		this.expensesInfoValue = thisMonthExpensesTotal ? thisMonthExpensesTotal : 0;

		this.balanceInfoValue = this.incomesInfoValue - this.expensesInfoValue;

		this.balanceValue = this.balanceInfoValue >= this.currentUser.balanceEdge ? `balance-value-normal` : `balance-value-limit`;
		if (this.balanceValue === `balance-value-limit`) {
			this.lowBalanceMessage = `${this.currentUser.name}, your balance limit equals to ${this.currentUser.balanceEdge}.
			Current balance is lower than that value. That's why you see this message.`;
		}

		this.storageService.updateUserBalance(this.incomesInfoValue, this.expensesInfoValue, this.balanceInfoValue);
	}
}
