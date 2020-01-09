import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePickerSetup, Transaction, ApplicationUser } from '../interfaces';
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
	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.key = event.key;
	}

	transactionSumLbl: string = `sum`;
	transactionCommentLbl: string = `comment`;
	saveTransactionLbl: string = `save`;
	datePickerSetup: DatePickerSetup = {
		placeholder: `date`,
		isFromDate: false,
		isToDate: false
	};
	invalidSumInputMessage: string = `Sum field may only contains a numeric values`;

	categoryName: string;
	categoryId: string;
	isSumInputInvalid: boolean;
	isSpinner: boolean;
	currentUser: ApplicationUser;
	transactionToEdit: Transaction;

	private userSubscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private transactionService: TransactionService,
		private validationService: ValidationService,
		private userService: UserService,
	) { }

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
	}

	updateTransaction() {
		const transactionToUpdate: Transaction = { ...this.transactionToEdit };
		transactionToUpdate.comment = this.comment;
		transactionToUpdate.date = this.date;
		transactionToUpdate.sum = Number(this.sum);
		const navigateUrl = `/${this.categoryName}/transactions`;
		this.isSpinner = true;
		this.transactionService.updateTransaction(transactionToUpdate, navigateUrl);
	}

	validateStringInputs(): boolean {
		const isDateValid = this.date instanceof Date ? true : false;
		const isSumValid = this.validationService.validateNumberInput(this.sum);
		if (!isSumValid) {
			this.isSumInputInvalid = true;
		}

		return isDateValid && isSumValid && this.categoryName ? true : false;
	}

	hideInvalidInputMessage(event) {
		this.isSumInputInvalid = false;
	}
}
