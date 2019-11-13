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


@Component({
	selector: 'app-expense-detail',
	templateUrl: './expense-detail.component.html',
	styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {

	@Output()
	dateInput: EventEmitter<MatDatepickerInputEvent<any>>

	currentUser: LoggedUser;
	categoryName: string;
	categoryDescription: string;
	categoryId: string;
	expensesTotalLabel: string;
	expensesTotal: number;
	expenses: FinanceData[];
	expensesToDisplay: FinanceData[];
	maxFromDate: Date;
	maxToDate: Date;
	toDateValue: FormControl;
	fromDateValue: FormControl;
	noCategoriesMessage: string;
	isAscSorted: boolean;
	headers = [`Date`, `Comment`, `Sum`, `Actions`];

	private subscription: Subscription;
	deleteExpenseModal: MatDialogRef<ModalComponent>;

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private route: ActivatedRoute,
		private snackBar: MatSnackBar,
		private dialog: MatDialog
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
		const today = new Date();
		this.toDateValue = new FormControl(today);
		this.fromDateValue = new FormControl(new Date(today.getFullYear(), today.getMonth(), 1));
		this.maxToDate = today;
		this.maxFromDate = today;
		const currentCategory = [...this.currentUser.categories].filter(category => category.id === this.categoryId)[0];
		this.categoryName = currentCategory.name;
		this.categoryDescription = currentCategory.description;
		this.expensesTotalLabel = `Selected period total:`;
		this.expenses = this.dataService.sortTransactionsByCategoryId(currentCategory.id, this.currentUser.transactions);
		const tooday = new Date();
		if (this.expenses.length !== 0) {
			this.expensesToDisplay = this.setSelectedPeriodTransactions(new Date(tooday.getFullYear(), tooday.getMonth(), 1), tooday)
		} else {
			this.noCategoriesMessage = `Hello, ${this.currentUser.name}. You do not have
			expenses for the selected period. You might choose another dates to check.`;
		}
		this.expensesTotal = this.expensesToDisplay && this.expensesToDisplay.length !== 0 ? this.dataService.countCategoryTransactionsTotal(this.expensesToDisplay) : 0;
	}

	setSelectedPeriodTransactions(startDate: Date, endDate: Date): FinanceData[] {

		return [...this.expenses].filter(transaction => (new Date(transaction.date) >= startDate) && (new Date(transaction.date) <= endDate));
	}

	sortExpenses(fieldToSort: string) {
		const fieldName = fieldToSort.toLowerCase();
		if (this.isAscSorted) {
			this.expensesToDisplay = [...this.expensesToDisplay].sort(function (a, b) {
				if (a[fieldName] < b[fieldName]) { return 1; }
				if (a[fieldName] > b[fieldName]) { return -1; }
				return 0;
			});
			this.isAscSorted = false;
		} else {
			this.expensesToDisplay = [...this.expensesToDisplay].sort(function (a, b) {
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
				message: `Are you sure you want to delete this expense?`
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
		this.dataService.setCategoryToUpsert(expense);
		this.router.navigate([`/categories/${this.categoryName}/edit/${this.categoryId}`]);
	}


	doUpdateTransactionCall(expenses: FinanceData[]) {
		const requestUrl = `${environment.apiBaseUrl}/transaction/edit`;
		let snackMessage: string;
		let action: string;
		this.http.post(requestUrl, {
			tarnsactionsToEdit: expenses
		}, { observe: 'response' }
		).subscribe(
			response => {
				snackMessage = 'Done';
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				console.log('---> DELETED EXP upserted ', response);
				this.dataService.updateToken(response.headers.get('Authorization'));
			},
			error => {
				console.log('---> DELETED EXP ERROR ', error);
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

	onDateInputFrom(event) {
		console.log('---> date input FROM', event.target.value);
	}

	onDateInputTo(event) {
		console.log('---> date input TO', event.target.value);
	}

	paginateExpenses(event) {
		console.log('---> event ', event);
	}

}
