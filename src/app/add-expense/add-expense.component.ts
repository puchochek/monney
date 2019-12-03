import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FinanceData, LoggedUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment'
import { Subscription } from 'rxjs';
import { TransactionService } from '../transaction.service';
import { UserService } from '../user.service';


@Component({
	selector: 'app-add-expense',
	templateUrl: './add-expense.component.html',
	styleUrls: ['./add-expense.component.scss'],
	providers: []
})
export class AddExpenseComponent implements OnInit {
	@Input() sum: number;
	@Input() comment: string;

	currentUser: LoggedUser;
	category: string;
	status: string;
	isInvalidInput: boolean;
	invalidInputMessage: string;
	dateShiftRight: number;
	message: string;
	savedExpense: FinanceData;
	title: string;
	addNewAction: string;
	editAction: string;
	transactionName: string;
	invaildSumMessage: string;
	isEdit: boolean;
	transactionSum: number;
	transactionToEdit: FinanceData;
	date = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	maxDate = new Date();
	balance: number;
	selectedCategory: string;
	// minDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
	private subscription: Subscription;

	constructor(
		private dataService: DataService,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar,
		private transactionService: TransactionService,

	) { }

	ngOnInit() {
		console.log('---> AddExpenseComponent' );
		this.selectedCategory = this.route.snapshot.paramMap.get('category');
		this.transactionName = this.selectedCategory === `Income` ?
			`Income`
			: `expense`;

		if (this.transactionName !== `Income`) {
			this.doUserControllerCall();
		}

		this.isEdit = this.route.snapshot.paramMap.get('action') === `edit` ? true : false;
		if (this.isEdit) {
			this.subscription = this.transactionService._transaction.subscribe((response) => {
				console.log('--->  ADD EXPENSE _transaction ', response);
				if (response) {
					this.transactionToEdit = <FinanceData>response;
				} else {
					this.router.navigate([`/home`]);
				}
			});
		}

		this.category = this.selectedCategory;
		this.addNewAction = `Add new`;
		this.editAction = `Edit`;
		this.title = this.isEdit ?
			`${this.editAction} ${this.transactionName}`
			: `${this.addNewAction} ${this.transactionName}`;
		if (this.isEdit) {
			this.sum = Number(this.transactionToEdit.sum);
			this.comment = this.transactionToEdit.comment;
			this.date = new FormControl(this.transactionToEdit.date);
		}
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	onSubmit() {
		const newExpence = {
			sum: this.sum,
			comment: this.comment,
			type: this.category,
			date: this.date.value,
		};
		if (this.validateSum(newExpence.sum)) {
			if (this.isEdit) {
				this.editTransaction(newExpence);
			} else {
				this.saveNewExpence(newExpence);
			}
		}
	}

	closeModal() {
		if (this.isEdit && this.transactionName !== `Income`) {
			this.router.navigate([`/detail/${this.selectedCategory}`]);
		} else {
			this.router.navigate([`/home`]);
		}
	}

	hideErrorMessage() {
		this.isInvalidInput = false;
	}

	validateSum(sum: number): boolean {
		if (isNaN(sum) || (!sum) || (Number(sum) < 0)) {
			this.isInvalidInput = true;
			this.invaildSumMessage = `The Sum field may keep a positive number value only`;
			return false;
		} else {
			if (this.transactionName === `Income`) {
				this.isInvalidInput = false;
				return true;
			} else {
				if (sum < this.balance) {
					this.isInvalidInput = false;
					return true;
				}
			}
		}
		this.isInvalidInput = true;
		this.invaildSumMessage = `You may not spend more money than you have. Check your Incomes to continue.`;
		return false;
	}

	saveNewExpence(newExpence: any) {
		const userId = localStorage.getItem('userId');
		const categoryName = this.route.snapshot.paramMap.get('category');
		const requestUrl = `${environment.apiBaseUrl}/transaction/create`;
		const navigateUrl = `/home`;
		const transactionToSave: FinanceData = {
			comment: newExpence.comment,
			id: null,
			sum: newExpence.sum,
			category: categoryName,
			userId: userId,
			isDeleted: false,
			date: newExpence.date
		};
		this.doTransactionControllerCall(transactionToSave, requestUrl, navigateUrl);
	}

	editTransaction(transaction: any) {
		const transactionToSave: FinanceData = {
			comment: transaction.comment,
			id: this.transactionToEdit.id,
			sum: transaction.sum,
			category: this.transactionToEdit.category,
			userId: this.transactionToEdit.userId,
			isDeleted: this.transactionToEdit.isDeleted,
			date: transaction.date
		};
		const requestUrl = `${environment.apiBaseUrl}/transaction/edit`;
		let navigateUrl: string;
		if (this.transactionName !== `Income` && !this.transactionToEdit) {
			navigateUrl = `/home`;
		} else {
			navigateUrl = `/detail/${this.selectedCategory}`;
		}
		this.doTransactionControllerCall(transactionToSave, requestUrl, navigateUrl);
	}

	doTransactionControllerCall(transaction: FinanceData, requestUrl: string, navigateUrl: string) {
		let snackMessage: string;
		let action: string;
		const transactionsToUpsert = [transaction];
		this.http.post(requestUrl, {
			transactionsToUpsert: transactionsToUpsert
		}, { observe: 'response' }
		).subscribe(
			response => {
				this.status = 'Done';
				snackMessage = this.status;
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				this.savedExpense = <FinanceData>response.body;
				console.log('---> ADD EXP savedExpense ', this.savedExpense);
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> SAVE EXPENSE ERROR ', error);
				this.status = 'Oops!';
				snackMessage = this.status;
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

	doUserControllerCall() {
		const token = localStorage.getItem("token");
		if (token) {
			const tokenisedId = localStorage.getItem("token").split(" ")[1];
			const url = `${environment.apiBaseUrl}/user/user-by-token/${tokenisedId}`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						this.setBalanceInfo();
					},
					error => {
						console.log('---> HOME error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	setBalanceInfo() {
		const IncomeId = this.dataService.findIncomeId(this.currentUser);
		const expensesTotal = this.dataService.setThisMonthExpensesTotal(this.currentUser, IncomeId);
		const IncomesTotal = this.dataService.setThisMonthIncomesTotal(this.currentUser, IncomeId);
		const balanceTotal = this.dataService.setThisMonthBalanceTotal(IncomesTotal, expensesTotal);

		this.balance = balanceTotal;
	}
}
