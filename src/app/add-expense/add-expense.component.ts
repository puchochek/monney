import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FinanceData } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment'
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-add-expense',
	templateUrl: './add-expense.component.html',
	styleUrls: ['./add-expense.component.scss'],
	providers: []
})
export class AddExpenseComponent implements OnInit {
	@Input() sum: number;
	@Input() comment: string;

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
	isEdit: boolean;
	transactionSum: number;
	transactionToEdit: FinanceData;
	date = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	maxDate = new Date();
	// minDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
	private sbscr: Subscription;

	constructor(
		private dataService: DataService,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.isEdit = this.route.snapshot.paramMap.get('action') === `edit` ? true : false;

		if (this.isEdit) {
			this.sbscr = this.dataService.categoryToUpsert.subscribe((response) => {
				console.log('--->  ADD EXPENSE FROM SERVICE categoryToUpsert INIT', response);
				if (response) {
					this.transactionToEdit = <FinanceData>response;
				}
			});
		}
		const selectedCategory = this.route.snapshot.paramMap.get('category');
		this.category = selectedCategory;
		this.addNewAction = `Add new`;
		this.editAction = `Edit`;
		this.transactionName = selectedCategory === `Income` ?
			`income`
			: `expense`;
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
		if (this.sbscr) {
			this.sbscr.unsubscribe();
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
		if (this.isEdit && this.transactionName !== `income`) {
			this.router.navigate([`/detail/${this.transactionToEdit.category}`]);
		} else {
			this.router.navigate([`/home`]);
		}
	}

	hideErrorMessage() {
		this.isInvalidInput = false;
	}

	validateSum(sum: number): boolean {
		if (isNaN(sum) || (!sum)) {
			this.isInvalidInput = true;
			return false;
		} else {
			this.isInvalidInput = false;
			return true;
		}
	}

	saveNewExpence(newExpence: any) {
		const userId = localStorage.getItem('userId');
		const categoryId = this.route.snapshot.paramMap.get('categoryId');
		const requestUrl = `${environment.apiBaseUrl}/transaction/create`;
		const navigateUrl = `/home`;
		const transactionToSave: FinanceData = {
			comment: newExpence.comment,
			id: null,
			sum: newExpence.sum,
			category: categoryId,
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
		if (this.transactionName === `income`) {
			navigateUrl = `/balance`; //TODO Change
		}
		if (this.transactionName !== `income` && this.transactionToEdit) {
			navigateUrl = `/detail/${this.transactionToEdit.category}`;
		}
		if (this.transactionName !== `income` && !this.transactionToEdit) {
			navigateUrl = `/home`;
		}
		this.doTransactionControllerCall(transactionToSave, requestUrl, navigateUrl);
	}

	doTransactionControllerCall(transaction: FinanceData, requestUrl: string, navigateUrl: string) {
		let snackMessage: string;
		let action: string;
		const userId = localStorage.getItem('userId');
		const categoryId = this.route.snapshot.paramMap.get('categoryId');
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
}
