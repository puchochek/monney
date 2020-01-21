import { Component, OnInit, Input, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePickerSetup, Transaction, ApplicationUser, UserBalance } from '../interfaces';
import { TransactionService } from '../transaction.service';
import { UserService } from '../user.service';
import { ValidationService } from '../validation.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
	@Input() sum: string;
	@Input() comment: string;
	@Input() date: Date;
	key: any;
	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.key = event.key;
	}
	@ViewChild("sumInput", { static: false }) _el: ElementRef;


	transactionSumLbl: string = `sum`;
	transactionCommentLbl: string = `comment`;
	saveTransactionLbl: string = `save`;
	datePickerSetup: DatePickerSetup = {
		placeholder: `date`,
		isFromDate: false,
		isToDate: false,
	};

	invalidSumInputMessage: string;
	categoryName: string;
	categoryId: string;
	isSumInputInvalid: boolean;
	isSpinner: boolean;
	currentUser: ApplicationUser;
	transactionToEdit: Transaction;
	currentBalance: number;

	private userSubscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private transactionService: TransactionService,
		private validationService: ValidationService,
		private userService: UserService,
	) { }

	ngAfterViewInit() {
		this._el.nativeElement.focus();
	}

	ngOnInit() {
		this.date = new Date();
		this.categoryName = this.route.snapshot.paramMap.get('category');
		if (this.route.snapshot.paramMap.get('id')) {
			this.categoryId = this.route.snapshot.paramMap.get('id');
		}
		if (this.categoryId) {
			this.userSubscription = this.userService._user.subscribe(response => {
				if (response) {
					console.log('---> transaction USER ', response);
					this.currentUser = <ApplicationUser>response;
					this.transactionToEdit = this.currentUser.transactions.filter(transition => transition.id === this.categoryId)[0];
					this.sum = String(this.transactionToEdit.sum);
					this.comment = this.transactionToEdit.comment;
					this.date = new Date(this.transactionToEdit.date);
					this.datePickerSetup.dateValue = this.date;
				}
			});
		}
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	handleDateChange(newDate: Date) {
		this.date = newDate
	}

	handleSaveBtnClick() {
		const isInputValid = this.validateStringInputs();
		if (isInputValid) {
			if (this.categoryId) {
				this.updateTransaction();
			} else {
				this.createTransaction();
			}
		}
	}

	createTransaction() {
		const isSumLessThanBalance = this.checkTransactionSum();
		if (isSumLessThanBalance) {
			const transactionToSave: Transaction = {
				date: this.date,
				comment: this.comment,
				category: this.categoryName,
				sum: Number(this.sum),
				isDeleted: false
			};
			const navigateUrl = `/home`;
			this.isSpinner = true;
			this.transactionService.createTransaction(transactionToSave, navigateUrl);
		} else {
			this.isSumInputInvalid = true;
			this.invalidSumInputMessage = `You may not spend more money, than You have.
			Current balance equals to ${this.currentBalance}.`;
		}

	}

	updateTransaction() {
		const isSumLessThanBalance = this.checkTransactionSum();
		if (isSumLessThanBalance) {
			const transactionToUpdate: Transaction = { ...this.transactionToEdit };
			transactionToUpdate.comment = this.comment;
			transactionToUpdate.date = this.date;
			transactionToUpdate.sum = Number(this.sum);
			const navigateUrl = `/${this.categoryName}/transactions`;
			this.isSpinner = true;
			this.transactionService.updateTransaction(transactionToUpdate, navigateUrl);
		}

	}

	validateStringInputs(): boolean {
		const isDateValid = this.date instanceof Date ? true : false;
		const isSumValid = this.validationService.validateNumberInput(this.sum);
		if (!isSumValid) {
			this.isSumInputInvalid = true;
			this.invalidSumInputMessage = `Sum field may only contains a numeric values`;
		}

		return isDateValid && isSumValid && this.categoryName ? true : false;
	}

	checkTransactionSum() {
		if (this.categoryName === `Income`) {
			return true;
		}

		let isSumLessThanBalance: boolean;
		if (localStorage.getItem('userBalance')) {
			const currentUserBalance = <UserBalance>JSON.parse(localStorage.getItem('userBalance'));
			this.currentBalance = currentUserBalance.balance;
			if (Number(this.sum) < currentUserBalance.balance) {
				isSumLessThanBalance = true;
			}
		}

		return isSumLessThanBalance;
	}

	hideInvalidInputMessage(event) {
		this.isSumInputInvalid = false;
		console.log('---> this.isSumInputInvalid ', this.isSumInputInvalid);
	}
}
