import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { LoggedUser } from '../interfaces';
import { FinanceData } from '../interfaces';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TransactionService } from '../transaction.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-transaction-detail',
	templateUrl: './transaction-detail.component.html',
	styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {
	deleteExpenseModal: MatDialogRef<ModalComponent>;

	currentUser: LoggedUser;
	categoryName: string;
	categoryDescription: string;
	categoryId: string;
	transactionsTotalLabel: string;
	transactionsTotal: number;
	transactions: FinanceData[];
	transactionToDisplay: FinanceData[];
	fromDate: Date;
	toDate: Date;
	helloMessage: string;
	noTransactionMessage = `You do not have
	transactions for the selected period. You might choose another dates to check.`;
	isAscSorted: boolean;
	isLoading: boolean = true;
	headers = [`Date`, `Sum`, `Comment`, `Actions`];
	private subscription: Subscription;

	constructor(
		private dataService: DataService,
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private transactionService: TransactionService,
		private userService: UserService
	) { }

	ngOnInit() {
		this.categoryName = this.route.snapshot.paramMap.get('category');

		this.subscription = this.userService._user.subscribe((response) => {
			console.log('--->  TRANSACTION DETAIL _user ', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.setInitialData();
				this.isLoading = false;
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	setInitialData() {
		this.helloMessage = `Hi, ${this.currentUser.name}!`;
		const today = new Date();
		this.toDate = today;
		this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
		const currentCategory = [...this.currentUser.categories].filter(category => category.name === this.categoryName)[0];
		this.categoryDescription = currentCategory.description;
		this.transactionsTotalLabel = `Selected period total:`;
		this.setTransactionsToDiaplay(this.currentUser.transactions);
		this.setTransactionsTotal();
	}

	setTransactionsToDiaplay(transactions: FinanceData[]) {
		const today = new Date();
		const currentCategory = [...this.currentUser.categories].filter(category => category.name === this.categoryName)[0];
		this.transactions = this.dataService.sortTransactionsByCategoryId(currentCategory.id, transactions);

		if (this.transactions.length !== 0) {
			const thisPeriodTransactions = this.setSelectedPeriodTransactions(new Date(today.getFullYear(), today.getMonth(), 1), today);
			this.transactionToDisplay = this.filterDeletedTransactions(thisPeriodTransactions);
		}
	}

	setSelectedPeriodTransactions(startDate: Date, endDate: Date): FinanceData[] {

		return [...this.transactions].filter(
			transaction =>
				(new Date(new Date(transaction.date).toDateString()) >= new Date(startDate.toDateString()))
				&& new Date(new Date(transaction.date).toDateString()) <= new Date(endDate.toDateString())
		);
	}

	sortExpenses(fieldToSort: string) {
		const fieldName = fieldToSort.toLowerCase();
		if (this.isAscSorted) {
			this.transactionToDisplay = [...this.transactionToDisplay].sort(function (a, b) {
				if (a[fieldName] < b[fieldName]) { return 1; }
				if (a[fieldName] > b[fieldName]) { return -1; }
				return 0;
			});
			this.isAscSorted = false;
		} else {
			this.transactionToDisplay = [...this.transactionToDisplay].sort(function (a, b) {
				if (a[fieldName] < b[fieldName]) { return -1; }
				if (a[fieldName] > b[fieldName]) { return 1; }
				return 0;
			});
			this.isAscSorted = true;
		}
	}

	openDeleteCategoryDialog(expense: FinanceData) {
		this.deleteExpenseModal = this.dialog.open(ModalComponent, {
			hasBackdrop: false,
			data: {
				message: `Are you sure you want to delete this transaction?`
			}
		});
		this.deleteExpenseModal
			.afterClosed()
			.subscribe(isActionConfirmed => {
				if (isActionConfirmed) {
					expense.isDeleted = true;
					const navigateUrl = `/detail/:${this.categoryName}`;
					this.transactionService.deleteTransaction(expense, navigateUrl);
				}
			});
	}

	editExpense(expense: FinanceData) {
		this.transactionService.currentTransaction = expense;
		this.router.navigate([`/transaction/edit/${this.categoryName}`]);
	}

	filterDeletedTransactions(transactions: FinanceData[]): FinanceData[] {
		return transactions.filter(transaction => !transaction.isDeleted);
	}

	handleFromDateChange(newDate) {
		this.transactionToDisplay = this.setSelectedPeriodTransactions(newDate, this.toDate);
		this.fromDate = newDate;
		this.setTransactionsTotal();
	}

	handleToDateChange(newDate) {
		this.transactionToDisplay = this.setSelectedPeriodTransactions(this.fromDate, newDate);
		this.toDate = newDate;
		this.setTransactionsTotal();
	}

	setTransactionsTotal() {
		this.transactionsTotal = this.transactionToDisplay && this.transactionToDisplay.length !== 0 ? this.dataService.countCategoryTransactionsTotal(this.transactionToDisplay, `sum`) : 0;
	}
}
