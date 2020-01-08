import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePickerSetup, Transaction } from '../interfaces';
import { TransactionService } from '../transaction.service';
import { ValidationService } from '../validation.service';


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
	isSumInputInvalid: boolean;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private transactionService: TransactionService,
		private validationService: ValidationService

	) { }

	ngOnInit() {
		this.date = new Date();
		this.categoryName = this.route.snapshot.paramMap.get('category');
	}

	handleDateChange(newDate: Date) {
		this.date = newDate
	}

	saveTransaction() {
		const isInputValid = this.validateStringInputs();
		if (isInputValid) {
			const transactionToSave: Transaction = {
				//id?: string;
				//user?: string;
				date: this.date,
				comment: this.comment,
				category: this.categoryName,
				sum: Number(this.sum),
				isDeleted: false
			};
			const navigateUrl = `/home`;
			this.transactionService.createTransaction(transactionToSave, navigateUrl);
		}

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
		console.log('---> hideInvalidInputMessage ');
		this.isSumInputInvalid = false;
	}

}
