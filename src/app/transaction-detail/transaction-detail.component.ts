import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { LoggedUser } from '../interfaces';
import { ScreenService } from '../screen.service';
import { FinanceData } from '../interfaces';
import { Category } from '../interfaces';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TransactionService } from '../transaction.service';


@Component({
	selector: 'app-transaction-detail',
	templateUrl: './transaction-detail.component.html',
	styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {
	@Output()
	dateInput: EventEmitter<MatDatepickerInputEvent<any>>

	currentUser: LoggedUser;
	categoryName: string;
	categoryDescription: string;
	categoryId: string;
	transactionsTotalLabel: string;
	transactionsTotal: number;
	transactions: FinanceData[];
	transactionToDisplay: FinanceData[];
	maxFromDate: Date;
	maxToDate: Date;
	minToDate: Date;
	minFromDate: Date;
	toDateValue: FormControl;
	fromDateValue: FormControl;
	helloMessage: string;
	noTransactionMessage = `You do not have
	transactions for the selected period. You might choose another dates to check.`;
	isAscSorted: boolean;
	isValidFromDate: boolean;
	isValidToDate: boolean;
	isLoading: boolean = true;

	headers = [`Date`, `Sum`, `Comment`, `Actions`];

	private subscription: Subscription;
	deleteExpenseModal: MatDialogRef<ModalComponent>;


	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private route: ActivatedRoute,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private transactionService: TransactionService
	) { }

	ngOnInit() {
		this.categoryId = this.route.snapshot.paramMap.get('category');
		const userId = localStorage.getItem("userId");
		const url = `${environment.apiBaseUrl}/user/user-by-id/${userId}`;
		if (userId) {
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						console.log('---> DETAIL response ', response);
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
		this.isValidFromDate = true;
		this.isValidToDate = true;
		const today = new Date();
		this.toDateValue = new FormControl(today);
		this.fromDateValue = new FormControl(new Date(today.getFullYear(), today.getMonth(), 1));
		this.maxToDate = today;
		this.maxFromDate = today;
		const currentCategory = [...this.currentUser.categories].filter(category => category.id === this.categoryId)[0];
		this.categoryName = currentCategory.name;
		this.categoryDescription = currentCategory.description;
		this.transactionsTotalLabel = `Selected period total:`;
		this.transactions = this.dataService.sortTransactionsByCategoryId(currentCategory.id, this.currentUser.transactions);
		const tooday = new Date();
		if (this.transactions.length !== 0) {
			this.transactionToDisplay = this.setSelectedPeriodTransactions(new Date(tooday.getFullYear(), tooday.getMonth(), 1), tooday);
		}
		this.transactionsTotal = this.transactionToDisplay && this.transactionToDisplay.length !== 0 ? this.dataService.countCategoryTransactionsTotal(this.transactionToDisplay) : 0;
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
		//this.dataService.setCategoryToUpsert(expense);
		this.transactionService.currentTransaction = expense;
		this.router.navigate([`/categories/${this.categoryName}/edit/${this.categoryId}`]);
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

	onDateInputFrom(event) {
		this.isValidFromDate = true;
		const newDate = event.target.value;
		this.minToDate = newDate;
		const isValidDate = this.validateInputDate(newDate);
		if (isValidDate) {
			this.transactionToDisplay = this.setSelectedPeriodTransactions(newDate, new Date(this.toDateValue.value));
		} else {
			this.isValidFromDate = false;
		}
	}

	onDateInputTo(event) {
		this.isValidToDate = true;
		const newDate = event.target.value;
		this.maxFromDate = newDate;
		const isValidDate = this.validateInputDate(newDate);
		if (isValidDate) {
			this.transactionToDisplay = this.setSelectedPeriodTransactions(new Date(this.fromDateValue.value), newDate);
		} else {
			this.isValidToDate = false;
		}

	}

	validateInputDate(newDate: Date): boolean {
		if (newDate instanceof Date && !(newDate > new Date())) {
			return true;
		} else {
			return false;
		}
	}

}
