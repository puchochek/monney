import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { LoggedUser } from '../interfaces';
import { FinanceData } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TransactionService } from '../transaction.service';
import { UserService } from '../user.service';

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
	//categoryName: string;
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

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private route: ActivatedRoute,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private transactionService: TransactionService,
		private userService: UserService
	) { }

	ngOnInit() {
		//this.categoryId = this.route.snapshot.paramMap.get('category');
		this.categoryName = this.route.snapshot.paramMap.get('category');

		const token = localStorage.getItem("token");
		if (token) {
			const tokenisedId = localStorage.getItem("token").split(" ")[1];
			const url = `${environment.apiBaseUrl}/user/user-by-token/${tokenisedId}`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						if (!this.userService._user.hasOwnProperty('id')) {
							this.userService.appUser = {...this.currentUser};
						}
						this.dataService.updateToken(response.headers.get('Authorization'));
						this.setInitialData();
						this.isLoading = false;
					},
					error => {
						console.log('---> DETAIL error ', error);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	setInitialData() {
		this.helloMessage = `Hi, ${this.currentUser.name}!`;
		const today = new Date();
		this.toDate = today;
		this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
		const currentCategory = [...this.currentUser.categories].filter(category => category.name === this.categoryName)[0];
		//this.categoryName = currentCategory.name;
		this.categoryDescription = currentCategory.description;
		this.transactionsTotalLabel = `Selected period total:`;
		this.transactions = this.dataService.sortTransactionsByCategoryId(currentCategory.id, this.currentUser.transactions);

		if (this.transactions.length !== 0) {
			this.transactionToDisplay = this.setSelectedPeriodTransactions(new Date(today.getFullYear(), today.getMonth(), 1), today);
		}
		this.setTransactionsTotal();
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
					this.doUpdateTransactionCall([expense]);
				}
			});
	}

	editExpense(expense: FinanceData) {
		this.transactionService.currentTransaction = expense;
		this.router.navigate([`/transaction/edit/${this.categoryName}`]);
	}

	doUpdateTransactionCall(expenses: FinanceData[]) {
		const requestUrl = `${environment.apiBaseUrl}/transaction/edit`;
		let snackMessage: string;
		let action: string;
		this.http.post(requestUrl, {
			transactionsToUpsert: expenses
		}, { observe: 'response' }
		).subscribe(
			response => {
				snackMessage = 'Done';
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				console.log('---> TRANSACTION DETAIL EXP upserted ', <FinanceData[]>response.body);
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.updateExpensesList(<FinanceData[]>response.body);
			},
			error => {
				console.log('---> TRANSACTION DETAIL EXP ERROR ', error);
				snackMessage = 'Oops!';
				action = `Try again`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	updateExpensesList(deletedExpenses: FinanceData[]) {
		const deletedExpensesIds = deletedExpenses.reduce((deletedExpensesList, deletedExpense) => {
			deletedExpensesList.push(deletedExpense.id);
			return deletedExpensesList;
		}, []);
		this.transactionToDisplay = [...this.transactionToDisplay].filter(expense => !deletedExpensesIds.includes(expense.id));
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
